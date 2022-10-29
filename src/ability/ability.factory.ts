import { Injectable } from "@nestjs/common";
import { CreateAbility } from "@casl/ability";
import { PrismaQuery } from "@casl/prisma";
import { User } from "@prisma/client";
import { createMongoAbility } from "@casl/ability";

type Actions = "create" | "read" | "update" | "delete";
type Subjects = "Article" | "Comment" | "User";

const ability = createMongoAbility<[Actions, Subjects]>();

@Injectable()
export class AbilityFactory {}
