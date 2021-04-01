import { Module } from "@nestjs/common";
import { AppController } from "./controller";
import { Service } from "./service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [Service],
})
export class AppModule {}
