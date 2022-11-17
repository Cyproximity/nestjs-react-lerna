import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Express, Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { SystemRole, User } from "@prisma/client";
import { createReadStream } from "fs";
import { join } from "path";
import * as sharp from "sharp";

import { AccessTokenGuard, RolesGuard } from "../auth/guard";
import { GetUser, Roles } from "../decorator";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";
import { storage } from "../utils";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get("whoami")
  getMe(@GetUser() user: User): User {
    this.userService.testEmailer(user);
    return user;
  }

  @UseGuards(AccessTokenGuard)
  @Patch()
  async editUser(
    @GetUser("id") id: number,
    @Body() dto: EditUserDto,
  ): Promise<User> {
    return this.userService.editUser(id, dto);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor("file", { storage }))
  @Post("avatar")
  async uploadAvatar(
    @GetUser("id") id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })
        .addMaxSizeValidator({ maxSize: 6e6 })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(id, file.path);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(SystemRole.Admin, SystemRole.Moderator)
  @Patch("bans/:id")
  async toggleBan() {
    return "banning user";
  }

  @UseGuards(AccessTokenGuard)
  @Roles(SystemRole.Admin)
  @UseGuards(RolesGuard)
  @Delete(":id")
  async deleteUser() {
    // return this.userService.delete
    return "deleting user";
  }

  @Get(":username")
  async getUser(@Param("username") username: string) {
    return this.userService.getUser(username);
  }

  @Get(":username/avatar")
  async getAvatar(
    @Param("username") username: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const avatar = await this.userService.getAvatar(username);

    const filepath = join(process.cwd(), avatar.path);
    const file = createReadStream(filepath);
    const metadata = await sharp(filepath).metadata();
    res.setHeader("Content-Type", `image/${metadata.format}`);

    return new StreamableFile(file);
  }
}
