import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JWTRedirectGuard, RolesGuard } from "./guard";
import { AccessTokenStrategy, RefreshTokenStrategy } from "./strategy";

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    JWTRedirectGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
