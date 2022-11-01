import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { CacheService } from "../../cache/cache.service";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
    private cache: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const authorization = req.get("Authorization");
    let accessToken: string = "";

    if (authorization) {
      accessToken = authorization.replace("Bearer", "").trim();
    }

    if (accessToken) {
      const ignoredTokens = await this.cache.getIngoredTokens();
      if (
        ignoredTokens &&
        ignoredTokens.size > 0 &&
        ignoredTokens.has(accessToken)
      ) {
        return null;
      }
    }

    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: payload.sub },
      });

      if (user.email !== payload.email) return null;

      delete user.hash;

      if (req.url == "/auth/logout") {
        await this.cache.setIgnoreToken(accessToken);
      }

      return { tokenid: payload?.tokenid, ...user };
    } catch (e) {
      return null;
    }
  }
}
