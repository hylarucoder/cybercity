import { Module } from "@nestjs/common";
import { AppModule as CanvasModule } from "./canvas/module";
import { AppModule as UserModule } from "./user/module";

@Module({
  imports: [CanvasModule, UserModule],
})
export class AppModule {}
