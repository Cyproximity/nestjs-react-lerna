import {
  Body,
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ApiOkResponse, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AuthDto,
    description: "returns a access_token",
  })
  @Post("signup")
  async signup(@Body() dto: AuthDto): Promise<{ access_token: string }> {
    return this.authService.signup(dto);
  }

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
}
