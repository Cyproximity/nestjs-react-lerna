import { InjectQueue } from "@nestjs/bull";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Queue } from "bull";
import { PrismaService } from "../prisma/prisma.service";
import { EditUserDto } from "./dto";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue("users-queue") private queue: Queue,
  ) {}

  testEmailer(user) {
    this.queue.add("verify-email", {
      email: user.email,
      subject: "Verify your email",
      context: { name: user.name, username: user.username },
    });
  }

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;

    return user;
  }

  async getUser(username: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
        select: {
          username: true,
          name: true,
          displayName: true,
          avatar: true,
        },
      });
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAvatar(username: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
        select: {
          username: true,
          name: true,
          displayName: true,
          avatar: true,
        },
      });

      if (!user) {
        throw new NotFoundException();
      }

      if (!user.avatar) {
        throw new NotFoundException();
      }

      const photo = await this.prisma.photo.findUnique({
        where: { id: user.avatar },
      });

      if (!photo) {
        throw new NotFoundException();
      }

      return photo;
    } catch (error) {
      throw error;
    }
  }

  async uploadAvatar(userId: number, path: string) {
    const photo = await this.prisma.photo.create({
      data: {
        path: path,
        scope: "avatar",
        uid: userId,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatar: photo.id,
      },
    });

    this.queue.add("img-transform", photo);

    return photo;
  }
}
