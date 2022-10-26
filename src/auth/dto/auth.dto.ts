import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";

export const AuthZ = extendApi(
  z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
);

export class AuthDto extends createZodDto(AuthZ) {}
