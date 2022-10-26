import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as argon from "argon2";

import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    // generates password hash
    const hash = await argon.hash(dto.password);

    try {
      // save the email & hash to user.db
      const user = await this.prisma.user.create({
        data: { hash, email: dto.email },
      });

      // returns user obj
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("Credentials taken.");
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
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

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: email,
    };

    const secret = this.config.get("JWT_SECRET");

    // generate access token for 15 minutes
    const access_token = await this.jwt.signAsync(payload, {
      secret: secret,
      expiresIn: "15m",
    });

    // returns access token
    return { access_token };
  }
}
