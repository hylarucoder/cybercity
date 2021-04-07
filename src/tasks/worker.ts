import { QueueEvents, Worker } from "bullmq";

export const initWorker = () => {
  const queueEvents = new QueueEvents("DefaultQueue", {
    connection: {
      host: "localhost",
      port: 6379,
    },
  });

  queueEvents.on("waiting", ({ jobId }) => {
    console.log(`A job with ID ${jobId} is waiting`);
  });

  queueEvents.on("active", ({ jobId, prev }) => {
    console.log(`Job ${jobId} is now active; previous status was ${prev}`);
  });

  queueEvents.on("completed", ({ jobId, returnvalue }) => {
    console.log(`${jobId} has completed and returned ${returnvalue}`);
  });

  queueEvents.on("failed", ({ jobId, failedReason }) => {
    console.log(`${jobId} has failed with reason ${failedReason}`);
  });
  queueEvents.on("progress", ({ jobId, data }, timestamp) => {
    console.log(`${jobId} reported progress ${data} at ${timestamp}`);
  });

  const worker = new Worker(
    "DefaultQueue",
    async (job) => {
      console.log(job.data);
    },
    {
      connection: {
        host: "localhost",
        port: 6379,
      },
    },
  );

  worker.on("completed", (job) => {
    console.log(`${job.id} has completed!`);
  });

  worker.on("failed", (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
  });

  setTimeout(() => {
    worker.close();
    queueEvents.close()
  }, 30 * 1000);
};
