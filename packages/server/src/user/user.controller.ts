import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Res,
  UseGuards,
} from "@nestjs/common";
import { SystemRole, User } from "@prisma/client";
import { Response } from "express";

import { AccessTokenGuard, RolesGuard } from "../auth/guard";
import { GetUser, Roles } from "../decorator";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";

@UseGuards(AccessTokenGuard)
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("me")
  getMe(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: User,
  ): User {
    return user;
  }

  @Patch()
  async editUser(
    @GetUser("id") id: number,
    @Body() dto: EditUserDto,
  ): Promise<User> {
    return this.userService.editUser(id, dto);
  }

  @Roles(SystemRole.Admin, SystemRole.Moderator)
  @Patch("bans/:id")
  async toggleBan() {
    return "banning user";
  }

  @Roles(SystemRole.Admin)
  @UseGuards(RolesGuard)
  @Delete(":id")
  async deleteUser() {
    // return this.userService.delete
    return "deleting user";
  }
}
