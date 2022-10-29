import { Module } from "@nestjs/common";
import { AbilityFactory } from "./ability.factory";

@Module({
  providers: [AbilityFactory],
})
export class AbilityModule {}
