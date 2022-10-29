import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookmarkDto, UpdateBookmarkDto } from "./dto";

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    return bookmarks;
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId: userId,
        title: dto.title,
        description: dto?.description,
        link: dto.link,
      },
    });

    return bookmark;
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id: bookmarkId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException("Access to bookmark by user denied.");
    }

    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: UpdateBookmarkDto,
  ) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id: bookmarkId },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException("Access to bookmark by user denied.");
    }

    const update = await this.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: {
        ...dto,
      },
    });

    return update;
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id: bookmarkId },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException("Access to bookmark by user denied.");
    }

    await this.prisma.bookmark.delete({
      where: { id: bookmarkId }
    })
  }
}
