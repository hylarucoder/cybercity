import * as path from "path";
import fastify, { FastifyInstance } from "fastify";
import PluginStatic from "fastify-static";
import PluginCors from "fastify-cors";
import PluginSchedule from "fastify-schedule";
import { PluginSocketIO } from "./plugins/plugin-socketio";
import { PluginColorfulRoutes } from "./plugins/plugin-colorful-routes";
import { PluginDB } from "@/plugins/plugin-db";
import * as pov from "point-of-view";
import * as ejs from "ejs";
import { Socket } from "socket.io";

import { routes as homeRoutes } from "./apps/home/views";
import { routes as userRoutes } from "./apps/user/views";
import { routes as canvasRoutes } from "./apps/canvas/views";
import { PrismaClient } from "@prisma/client";
import {Celery, PluginCelery} from "@/plugins/plugin-celery";

// using declaration merging, add your plugin props to the appropriate fastify interfaces
declare module "fastify" {
  interface FastifyRequest {
    myPluginProp: string;
  }

  interface FastifyReply {
    myPluginProp: number;
  }

  interface FastifyInstance {
    printAllRoutes: () => void;
    io: Socket;
    prisma: PrismaClient;
    celery: Celery,
  }
}

const initLogger = () => {
  return {
    prettyPrint: {
      colorize: true,
      translateTime: true,
      ignore: "hostname",
    },
  };
};

function initStatic(app: FastifyInstance) {
  app.log.info("初始化静态地址模块");
  app.register(PluginStatic, {
    root: path.join(__dirname, "../public"),
    prefix: "/",
  });
}

function initRoutes(app: FastifyInstance) {
  app.log.info("初始化路由模块");
  app.register(PluginColorfulRoutes);
  app.register(homeRoutes);
  app.register(userRoutes, { prefix: "/api/user" });
  app.register(canvasRoutes, { prefix: "/api/canvas" });
}

function initCors(app: FastifyInstance) {
  app.log.info("初始化Cors");
  app.register(PluginCors);
}

function initSchedule(app: FastifyInstance) {
  app.log.info("初始化调度模块");
  app.register(PluginSchedule);

  // const task = new AsyncTask(
  //   "simple task",
  //   () => {
  //     console.log("simple task");
  //     return "";
  //   },
  //   (err: Error) => {
  //     /* handle errors here */
  //   },
  // );
  // const job = new SimpleIntervalJob({ seconds: 20 }, task);
  //
  // app.scheduler.addSimpleIntervalJob(job);
}

function initSocketIO(app: FastifyInstance) {
  app.log.info("初始化socketio相关设置");
  app.register(PluginSocketIO);
}

function initDB(app: FastifyInstance) {
  app.log.info("初始化db相关设置");
  app.register(PluginDB);
}

function initCelery(app: FastifyInstance) {
  app.log.info("初始化celery相关设置");
  app.register(PluginCelery);
}

function initTemplateEngine(app: FastifyInstance) {
  app.log.info("初始化模板引擎");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app.register(pov, {
    engine: {
      ejs: ejs,
    },
  });
}

type TOption = {
  type?: "web" | "beat" | "worker";
};

export function createApp(option: TOption = { type: "web" }): FastifyInstance {
  const logger = initLogger();
  const app: FastifyInstance = fastify({
    logger,
  });
  if (option.type === "web") {
    initSocketIO(app);
    initRoutes(app);
    initStatic(app);
    initTemplateEngine(app);
    initCors(app);
  }
  initCelery(app);
  initDB(app);
  if (option.type === "beat") {
    initSchedule(app);
  }
  return app;
}
