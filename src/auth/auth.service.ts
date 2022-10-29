import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { User, Token } from "@prisma/client";
import * as argon from "argon2";

import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import { CacheService } from "../cache/cache.service";

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private cache: CacheService,
  ) {}

  async signToken(
    payload: IPayload,
    secret: string,
    expiresIn: string,
  ): Promise<string> {
    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get(secret),
      expiresIn: this.config.get(expiresIn),
    });
    return token;
  }

  async generateTokens(user: User) {
    // create initial user->token to get its token.id
    const token = await this.prisma.token.create({
      data: { uid: user.id },
    });

    const accessTokenPayload = {
      sub: user.id,
      tokenid: token.id,
      email: user.email,
    };

    // token id as refrsh token sub
    const refreshTokenPayload = {
      sub: token.id,
      email: user.email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.signToken(accessTokenPayload, "JWT_SECRET", "JWT_SECRET_TTL"),
      this.signToken(
        refreshTokenPayload,
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_SECRET_TTL",
      ),
    ]);

    const tokenhash = await argon.hash(refresh_token);

    await this.prisma.token.update({
      where: { id: token.id },
      data: { hash: tokenhash, isValid: true },
    });

    return { access_token, refresh_token };
  }

  async signup(
    dto: AuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // generates password hash
    const hash = await argon.hash(dto.password);

    try {
      // save the email & hash to user.db
      const user = await this.prisma.user.create({
        data: {
          hash,
          email: dto.email,
          username: `user${Date.now()}`,
        },
      });

      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("Credentials taken.");
        }
      }
      throw error;
    }
  }

  async signin(
    dto: AuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user email not exists on the db
    if (!user) throw new ForbiddenException("Credentials incorrect.");

    // check if password and hash
    const pwVerify = await argon.verify(user.hash, dto.password);

    // if invalid password
    if (!pwVerify) throw new ForbiddenException("Credentials incorrect.");

    return this.generateTokens(user);
  }

  async refresh(
    token: Token,
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    await this.prisma.token.delete({ where: { id: token.id } });
    return this.generateTokens(user);
  }

  async logout(tokenid: number, accessToken: string): Promise<void> {
    try {
      await this.cache.setIgnoreToken(accessToken);
      await this.prisma.token.delete({ where: { id: tokenid } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new ForbiddenException();
      }
      throw error;
    }
  }
}

interface IPayload {
  sub: number;
  email: string;
}
