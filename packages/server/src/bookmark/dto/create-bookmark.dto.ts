import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";

const CreateBookmarkZ = extendApi(
  z.object({
    title: z.string().min(1).trim(),
    description: z.string().optional(),
    link: z.string().url(),
  }),
);

export class CreateBookmarkDto extends createZodDto(CreateBookmarkZ) {}
