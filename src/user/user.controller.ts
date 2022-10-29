import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { SystemRole, User } from "@prisma/client";

import { AccessTokenGuard, RolesGuard } from "../auth/guard";
import { GetUser, Roles } from "../decorator";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";

@UseGuards(AccessTokenGuard)
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

  @Roles(SystemRole.User)
  @Patch("bans/:id")
  async banUser() {}

  @Roles(SystemRole.Admin)
  @UseGuards(RolesGuard)
  @Delete()
  async deleteUser() {
    // return this.userService.delete
    return "deleting user";
  }
}
