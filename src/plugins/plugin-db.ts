import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

export const PluginDB = fp(
  (app, opts, done) => {
    const prisma = new PrismaClient();
    app.decorate("prisma", prisma);
    app.addHook("onClose", async (instance) => {
      await prisma.$disconnect();
    });
    done();
  },
  {
    fastify: "3.x",
    name: "sequelize-fastify",
  },
);
