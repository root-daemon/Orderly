import { Worker } from "bullmq";
import { scrapeProcedure } from "./procedure.js";

const initScraper = () => {
  const worker = new Worker(
    "scraper",
    async (job) => {
      try {
        const result = await scrapeProcedure(job);
        return result;
      } catch (error) {
        console.error(`Error processing job of type: ${job.data.type}`, error);
        throw error;
      }
    },
    {
      connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
      concurrency: 1,
    }
  );

  worker.on("completed", async (job) => {
    console.log(`Job completed`);
  });

  worker.on("failed", async (job, err) => {
    console.error(`Job failed with error:`, err);
  });

  worker.on("error", (err) => {
    console.error("Worker error:", err);
  });
};

export { initScraper };
