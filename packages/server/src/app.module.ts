import { Module, CacheModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BullModule } from "@nestjs/bull";
import { MailerModule } from "@nestjs-modules/mailer";
import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import { join } from "path";

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
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
    AppCacheModule,
    PrismaModule,
    AuthModule,
    UserModule,
    BookmarkModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: "stephanie.breitenberg@ethereal.email",
            pass: "Sq3SE2geRWD3BYtX1B",
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        template: {
          dir: join(process.cwd(), "/templates"),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class AppModule {}
