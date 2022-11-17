import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { UserQueueProcessor } from "./user.processor";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "users-queue",
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserQueueProcessor],
})
export class UserModule {}
