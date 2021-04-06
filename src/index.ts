import "reflect-metadata";
import "module-alias/register";

import { createApp } from "./app";

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3000;

const app = createApp();

app.listen(FASTIFY_PORT, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  app.log.info(`🚀  Server listening at ${address}`);
  app.printAllRoutes()
});
