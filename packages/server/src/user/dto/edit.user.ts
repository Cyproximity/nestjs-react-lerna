import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";

export const EditUserZ = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export class EditUserDto extends createZodDto(EditUserZ) {}
