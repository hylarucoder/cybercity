import fp from "fastify-plugin";
import { JobsOptions, Queue } from "bullmq";
import { FastifyInstance } from "fastify";

const option = {
  connection: {
    host: "localhost",
    port: 6379,
  },
};

export class Celery<T = any, N extends string = string> {
  queue: Queue;
  app: FastifyInstance;
  constructor(app: FastifyInstance) {
    this.queue = new Queue("BullDefault", option);
    this.app = app;
  }
  async addJob(data: T, opts?: JobsOptions, name = "BullDefault") {
    this.app.log.info(`${name} - ${JSON.stringify(data)}`);
    await this.queue.add(name, data, opts);
  }
}

export const PluginCelery = fp((app, opts, done) => {
  const celery = new Celery(app);
  app.decorate("celery", celery);
  app.addHook("onClose", async (instance) => {
    await celery.queue.close();
  });
  done();
}, {});
