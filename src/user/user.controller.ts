import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";

import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";

@UseGuards(JwtGuard)
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("me")
  getMe(@GetUser() user: User): User {
    return user;
  }

  @Patch()
  async editUser(
    @GetUser("id") id: number,
    @Body() dto: EditUserDto,
  ): Promise<User> {
    return this.userService.editUser(id, dto);
  }
}
