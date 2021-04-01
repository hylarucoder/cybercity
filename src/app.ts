import * as path from "path";
import fastify, { FastifyInstance } from "fastify";
import PluginStatic from "fastify-static";
import PluginCors from "fastify-cors";
import PluginSchedule from "fastify-schedule";
import * as pov from "point-of-view";
import * as ejs from "ejs";

import { routes as homeRoutes } from "./apps/home/views";
import { routes as userRoutes } from "./apps/user/views";
import { routes as canvasRoutes } from "./apps/canvas/views";
import { PluginSocketIO } from "./plugins/plugin-socketio";
import { PluginBlipp } from "./plugins/plugin-blipp";

// using declaration merging, add your plugin props to the appropriate fastify interfaces
declare module "fastify" {
  interface FastifyRequest {
    myPluginProp: string;
  }
  interface FastifyReply {
    myPluginProp: number;
  }
  interface FastifyInstance {
    blipp: () => void;
    io: () => void;
  }
}

function initStatic(app: FastifyInstance) {
  app.register(PluginStatic, {
    root: path.join(__dirname, "public"),
    prefix: "/",
  });
}
function initRoutes(app: FastifyInstance) {
  app.register(PluginBlipp);
  app.register(homeRoutes);
  app.register(userRoutes, { prefix: "/api/user" });
  app.register(canvasRoutes, { prefix: "/api/canvas" });
}

function initCors(app: FastifyInstance) {
  app.register(PluginCors);
}

function initSchedule(app: FastifyInstance) {
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
  app.register(PluginSocketIO);
}

function initTemplateEngine(app: FastifyInstance) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app.register(pov, {
    engine: {
      ejs: ejs,
    },
  });
}

export function createApp(): FastifyInstance {
  const app: FastifyInstance = fastify({
    logger: true,
  });
  initSocketIO(app);
  initStatic(app);
  initSchedule(app);
  initRoutes(app);
  initTemplateEngine(app);
  initCors(app);
  return app;
}
