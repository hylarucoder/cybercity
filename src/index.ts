import "reflect-metadata";
import "module-alias/register";
// import * as moduleAlias from "module-alias";
// console.log(__dirname + "/")
// moduleAlias.addAlias("@/", __dirname + "/");

import { createApp } from "./app";

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3000;

const app = createApp();

app.listen(FASTIFY_PORT, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
  console.log(`🚀  Fastify server running on port ${FASTIFY_PORT}`);
  app.blipp();
});
