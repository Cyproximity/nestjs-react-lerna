import * as pactum from "pactum";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { ZodValidationPipe } from "@anatine/zod-nestjs";
import { PrismaService } from "../src/prisma/prisma.service";
import { AuthDto } from "../src/auth/dto";
import { EditUserDto } from "../src/user/dto";
import { CreateBookmarkDto, UpdateBookmarkDto } from "../src/bookmark/dto";

const PORT = 1439;
const BASE_URL = "http://localhost:" + PORT;

describe("App e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ZodValidationPipe());

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDb();

    app.listen(PORT);
    pactum.request.setBaseUrl(BASE_URL);
  });

  afterAll(async () => {
    app.close();
  });

  const auth = { Authorization: "Bearer $S{access_token}" };

  describe("Auth", () => {
    const user: AuthDto = {
      email: "geraldagustin@outlook.com",
      password: "password",
    };

    describe("Sign Up", () => {
      it("should signup using email and password", () => {
        return pactum.spec().post("/auth/signup").withBody(user).expectStatus(201);
      });

      it("should throw if is email invalid", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({ email: "not a validemail", password: user.password })
          .expectStatus(400)
          .expectBodyContains("Invalid email");
      });

      it("should throw if password length < 6 characters", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({ email: user.email, password: "xxx" })
          .expectStatus(400)
          .expectBodyContains("password: String must contain at least 6 character(s)");
      });

      it("should throw if the email or password is empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({})
          .expectStatus(400)
          .expectBodyContains("password: Required")
          .expectBodyContains("email: Required");
      });
    });

    describe("Sign In", () => {
      it("should signin using email and password", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody(user)
          .expectStatus(200)
          .expectBodyContains("access_token")
          .stores("access_token", "access_token");
      });

      it("should throw if is email invalid", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({ email: "not a validemail", password: user.password })
          .expectStatus(400)
          .expectBodyContains("Invalid email");
      });

      it("should throw if password length < 6 characters", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({ email: user.email, password: "xxx" })
          .expectStatus(400)
          .expectBodyContains("password: String must contain at least 6 character(s)");
      });

      it("should throw if the email or password is empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({})
          .expectStatus(400)
          .expectBodyContains("password: Required")
          .expectBodyContains("email: Required");
      });
    });
  });

  describe("Users", () => {
    describe("Get me", () => {
      it("should get the current user", () => {
        return pactum.spec().get("/users/me").withHeaders(auth).expectStatus(200);
      });

      it("should throw if token is invalid", () => {
        return pactum.spec().get("/users/me").withHeaders({ Authorization: `Bearer zxy` }).expectStatus(401);
      });

      it("should throw if token is not present", () => {
        return pactum.spec().get("/users/me").expectStatus(401);
      });
    });

    const editUser: EditUserDto = {
      name: "Gerald",
    };

    describe("Edit current user", () => {
      it("should update the user name", () => {
        return pactum.spec().patch("/users").withHeaders(auth).withBody(editUser).expectBodyContains(editUser.name);
      });

      it("should throw if email is invalid", () => {
        return pactum
          .spec()
          .patch("/users")
          .withHeaders(auth)
          .withBody({ email: "123" })
          .expectStatus(400)
          .expectBodyContains("email: Invalid email");
      });

      it("should throw if token is invalid", () => {
        return pactum.spec().patch("/users").expectStatus(401);
      });
    });
  });

  describe("Bookmarks", () => {
    const createBookmark: CreateBookmarkDto = {
      title: "New bookmark",
      link: "https://www.youtube.com/watch?v=GHTA143_b-s",
      description: "NestJs Course for Beginners - Create a REST API",
    };

    describe("Create Bookmark", () => {
      it("should create a new bookmark", () => {
        return pactum
          .spec()
          .post("/bookmarks")
          .withHeaders(auth)
          .withBody(createBookmark)
          .expectStatus(201)
          .stores("bookmarkId", "id");
      });
    });

    describe("Get All Bookmarks", () => {
      it("should get all bookmark", () => {
        return pactum.spec().get("/bookmarks").withHeaders(auth).expectStatus(200).expectJsonLength(1);
      });

      it("should throw if user uses invalid token", () => {
        return pactum.spec().get("/bookmarks").expectStatus(401);
      });
    });

    describe("Get Bookmark by ID", () => {
      it("should get bookmark by ID", () => {
        return pactum
          .spec()
          .get("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders(auth)
          .withBody(createBookmark)
          .expectStatus(200);
      });
    });

    describe("Get Bookmark by ID", () => {
      it("should throw if user uses invalid bookmark ID", () => {
        return pactum
          .spec()
          .get("/bookmarks/{id}")
          .withPathParams("id", "312312")
          .withHeaders(auth)
          .withBody(createBookmark)
          .expectStatus(403);
      });
    });

    describe("Edit Bookmark by ID", () => {
      const editBookmark: UpdateBookmarkDto = {
        title: "Updated bookmark",
        link: "https://www.youtube.com/watch?v=GHTA143_b-s&t=12538s",
        description: "update bookmark description",
      };

      it("should edit a new bookmark", () => {
        return pactum
          .spec()
          .patch("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders(auth)
          .withBody(editBookmark)
          .expectStatus(200)
          .expectBodyContains(editBookmark.title)
          .expectBodyContains(editBookmark.description)
          .expectBodyContains(editBookmark.link);
      });
    });

    describe("Delete Bookmark", () => {
      it("should delete a bookmark", () => {
        return pactum
          .spec()
          .delete("/bookmarks/{id}")
          .withHeaders(auth)
          .withPathParams("id", "$S{bookmarkId}")
          .expectStatus(204);
      });

      it("should get empty bookmarks", () => {
        return pactum.spec().get("/bookmarks").withHeaders(auth).expectStatus(200).expectJsonLength(0);
      });
    });
  });
});
