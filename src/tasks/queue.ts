import { Queue } from "bullmq";

const queue = new Queue("DefaultQueue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

export async function addJobs() {
  await queue.add("DefaultQueue", { color: "blue" });
  await queue.add("DefaultQueue", { colour: "blue" }, { delay: 5000 });
  await queue.close()
}
