import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { GetUser } from "../decorator";
import { AuthDto } from "./dto";
import { AccessTokenGuard, JWTRedirectGuard, RefreshTokenGuard } from "./guard";

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
  async signup(@Body() dto: AuthDto): Promise<{ access_token: string }> {
    return this.authService.signup(dto);
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
  async signin(@Body() dto: AuthDto): Promise<{ access_token: string }> {
    return this.authService.signin(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@GetUser() user: any) {
    return await this.authService.logout(user.tokenid, user.accessToken);
  }

  @UseGuards(RefreshTokenGuard)
  @Get("refresh")
  async refresh(@GetUser() token: any, @GetUser("user") user: any) {
    return this.authService.refresh(token, user);
  }
}
