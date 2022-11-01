import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ZodValidationPipe, patchNestjsSwagger } from "@anatine/zod-nestjs";
import * as morgan from "morgan";
import * as cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { PrismaService } from "./prisma/prisma.service";

const PORT = 1433;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);

  app.use(morgan("tiny"));

  app.useGlobalPipes(new ZodValidationPipe());

  app.enableCors({ origin: "http://localhost:5173", credentials: true });
  app.use(cookieParser());

  // tell prisma to gracefully exit
  await prismaService.enableShutdownHooks(app);

  const documentBuilderConfig = new DocumentBuilder()
    .setTitle("Login and Bookmark")
    .setDescription("Login and bookmark app")
    .setVersion("1.0.0")
    .addTag("bookmarks")
    .addTag("auth")
    .build();

  patchNestjsSwagger();

  const document = SwaggerModule.createDocument(app, documentBuilderConfig);
  SwaggerModule.setup("api", app, document);

  await app.listen(PORT, () => {
    Logger.log(`Listening at http://localhost:${PORT}/`);
  });
}
bootstrap();
