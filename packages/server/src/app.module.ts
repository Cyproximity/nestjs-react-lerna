import { Module, CacheModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { UserModule } from "./user/user.module";
import { BookmarkModule } from "./bookmark/bookmark.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AppCacheModule } from "./cache/cache.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    AppCacheModule,
    PrismaModule,
    AuthModule,
    UserModule,
    BookmarkModule,
  ],
})
export class AppModule {}