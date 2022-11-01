import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as agron from "argon2";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.get("JWT_REFRESH_SECRET"),
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && "rtjwt" in req.cookies) {
      return req.cookies.rtjwt;
    }
    return null;
  }

  async validate(req: Request, payload: any) {
    const authorization = req.get("Authorization");
    let refreshToken: string = "";

    if (authorization) {
      refreshToken = authorization.replace("Bearer", "").trim();
    }

    if (!refreshToken) {
      if (req.cookies && "rtjwt" in req.cookies) {
        refreshToken = req.cookies.rtjwt;
      }
    }

    const token = await this.prisma.token.findUnique({
      where: { id: payload.sub },
      include: {
        user: { select: { email: true, id: true } },
      },
    });

    if (!token || !token.isValid) return null;
    if (token.user?.email !== payload.email) return null;
    const verifyHash = await agron.verify(token.hash, refreshToken);

    if (!verifyHash) return null;
    delete token.hash;
    return { ...token, refreshToken };
  }
}
