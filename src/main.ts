import { NestFactory } from "@nestjs/core";
import { join } from "path";
import { AppModule } from "./apps/app.module";
import { NestExpressApplication } from "@nestjs/platform-express";

async function createApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("ejs");
  await app.listen(3000);
}
createApp()
