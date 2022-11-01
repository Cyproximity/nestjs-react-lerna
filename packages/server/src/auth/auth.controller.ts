import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { GetUser } from "../decorator";
import { AuthDto } from "./dto";
import { AccessTokenGuard, JWTRedirectGuard, RefreshTokenGuard } from "./guard";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JWTRedirectGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AuthDto,
    description: "returns a access_token",
  })
  @Post("signup")
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: AuthDto,
  ): Promise<{ access_token: string }> {
    const tokens = await this.authService.signup(dto);
    res.cookie("rtjwt", tokens.refresh_token, { httpOnly: true });
    return tokens;
  }

  @UseGuards(JWTRedirectGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    type: AuthDto,
    description: "returns a access_token",
  })
  @Post("signin")
  @Header("Cache-Control", "none")
  @HttpCode(HttpStatus.OK)
  async signin(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: AuthDto,
  ): Promise<{ access_token: string }> {
    const tokens = await this.authService.signin(dto);
    res.cookie("rtjwt", tokens.refresh_token, { httpOnly: true });
    return tokens;
  }

  @UseGuards(AccessTokenGuard)
  @Get("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: any,
  ) {
    res.clearCookie("rtjwt");
    return await this.authService.logout(user.tokenid);
  }

  @UseGuards(RefreshTokenGuard)
  @Get("refresh")
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @GetUser() token: any,
    @GetUser("user") user: any,
  ) {
    const tokens = await this.authService.refresh(token, user);
    res.cookie("rtjwt", tokens.refresh_token, { httpOnly: true });
    return tokens;
  }
}
