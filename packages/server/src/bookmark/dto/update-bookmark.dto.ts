import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";

const updateBookmarkZ = extendApi(
  z.object({
    title: z.string().min(1).trim().optional(),
    description: z.string().optional(),
    link: z.string().url().optional(),
  }),
);

export class UpdateBookmarkDto extends createZodDto(updateBookmarkZ) {}
