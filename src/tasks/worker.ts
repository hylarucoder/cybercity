import { Worker } from "bullmq";
import { FastifyInstance } from "fastify";

export const initWorker = (app: FastifyInstance) => {
  const worker = new Worker(
    "BullDefault",
    async (job) => {
      app.log.info(`----> processing ${job.id} ${JSON.stringify(job.data)}`);
    },
    {
      connection: {
        host: "localhost",
        port: 6379,
      },
    },
  );

  worker.on("completed", (job) => {
    app.log.info(`${job.id} has completed!`);
  });

  worker.on("failed", (job, err) => {
    app.log.info(`${job.id} has failed with ${err.message}`);
  });
};
