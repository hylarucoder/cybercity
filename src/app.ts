import fastify from "fastify";
import staticPlugin from "fastify-static";
import corsPlugin from "fastify-cors";
import schedulePlugin from "fastify-schedule";
import websocketPlugin from 'fastify-websocket'
import { SimpleIntervalJob, AsyncTask } from "toad-scheduler";

import { routes } from "./apps/home/views";
import * as path from "path";

function initStatic(app) {
  app.register(staticPlugin, {
    root: path.join(__dirname, "public"),
    prefix: "/public/", // optional: default '/'
  });
}
function initRoutes(app) {
  app.register(routes);
}

function initCors(app) {
  app.register(corsPlugin);
}

function initSchedule(app) {
  app.register(schedulePlugin);

  const task = new AsyncTask(
    "simple task",
    () => {
      console.log("simple task");
      return "";
    },
    (err: Error) => {
      /* handle errors here */
    },
  );
  const job = new SimpleIntervalJob({ seconds: 20 }, task);

  app.scheduler.addSimpleIntervalJob(job);
}

export function createApp() {
  const app = fastify({
    logger: true,
  });
  initStatic(app);
  initSchedule(app);
  initRoutes(app);
  initCors(app);
  return app;
}
