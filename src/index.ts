import "reflect-metadata";
import "module-alias/register";
import * as repl from "repl";
import { Command } from "commander";

import { createApp } from "./app";
import { initWorker } from "@/tasks/worker";

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 8888;

function startServer() {
  const app = createApp();
  app.listen(FASTIFY_PORT, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    app.log.info(BANNER);
    app.log.info(`🚀  Server listening at ${address}`);
    app.printAllRoutes();
  });
}

function startBeatServer() {
  const app = createApp({
    type: "beat",
  });
  app.ready(async (error) => {
    app.log.info(BANNER);
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    }
    await app.celery.addJob({ id: "1" });
    await app.celery.addJob({ id: "2" });
    await app.celery.addJob({ id: "3" });
    await app.celery.addJob({ id: "4" });
    await app.celery.addJob({ id: "5" });
    await app.celery.addJob({ id: "6" });
    await app.celery.queue.close()
  });
}

function startWorker() {
  const app = createApp({
    type: "worker",
  });
  initWorker(app);
}

const BANNER = `
===================================================================

 _______       ___   ____    ____  __  .__   __.   ______  __  
|       \\     /   \\  \\   \\  /   / |  | |  \\ |  |  /      ||  | 
|  .--.  |   /  ^  \\  \\   \\/   /  |  | |   \\|  | |  ,----'|  | 
|  |  |  |  /  /_\\  \\  \\      /   |  | |  . \`  | |  |     |  | 
|  '--'  | /  _____  \\  \\    /    |  | |  |\\   | |  \`----.|  | 
|_______/ /__/     \\__\\  \\__/     |__| |__| \\__|  \\______||__| 


===================================================================

                             极速开发框架，拷贝在身边，一用好多年
                                              -- since 2021
`;

function startShell() {
  const app = createApp();
  app.ready((error) => {
    app.log.info(BANNER);
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    }
    const replInstance = repl.start();
    replInstance.context.app = app;
    Object.assign(replInstance.context, app.prisma);
  });
}

const program = new Command();
program
  .command("serve")
  .description("后端服务")
  .action(() => {
    startServer();
  });

program
  .command("beat")
  .description("调度服务")
  .action(() => {
    startBeatServer();
  });

program
  .command("worker")
  .description("Worker服务")
  .action(() => {
    startWorker();
  });

program
  .command("shell")
  .description("Repl调试命令")
  .action(() => {
    startShell();
  });

program.parse(process.argv);
