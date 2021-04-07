import { QueueEvents, Worker } from "bullmq";
import {FastifyInstance} from "fastify";

export const initWorker = (app: FastifyInstance) => {
  const queueEvents = new QueueEvents("BullDefault", {
    connection: {
      host: "localhost",
      port: 6379,
    },
  });

  queueEvents.on("waiting", ({ jobId }) => {
    app.log.info(`A job with ID ${jobId} is waiting`);
  });

  queueEvents.on("active", ({ jobId, prev }) => {
    app.log.info(`Job ${jobId} is now active; previous status was ${prev}`);
  });

  queueEvents.on("completed", ({ jobId, returnvalue }) => {
    app.log.info(`${jobId} has completed and returned ${returnvalue}`);
  });

  queueEvents.on("failed", ({ jobId, failedReason }) => {
    app.log.info(`${jobId} has failed with reason ${failedReason}`);
  });
  queueEvents.on("progress", ({ jobId, data }, timestamp) => {
    app.log.info(`${jobId} reported progress ${data} at ${timestamp}`);
  });

  const worker = new Worker(
    "BullDefault",
    async (job) => {
      app.log.info(`----> processing ${job.data}`);
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

  setTimeout(() => {
    worker.close();
    queueEvents.close()
  }, 30 * 1000);
};
