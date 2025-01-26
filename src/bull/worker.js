import { Worker } from "bullmq";
import { calendarProcedure, scrapeProcedure } from "./procedure.js";

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

const initCalendar = () => {
  const worker = new Worker(
    "calendar",
    async (job) => {
      try {
        const result = await calendarProcedure(job);
        return result;
      } catch (error) {
        job.error(`Error processing job of type: ${job.data.type}`, error);
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
    job.log(`Job completed`);
  });

  worker.on("failed", async (job, err) => {
    console.error(`Job failed with error:`, err);
    job.error(`Job failed with error:`, err);
  });

  worker.on("error", (err) => {
    console.error("Worker error:", err);
    job.error("Worker error:", err);
  });
};

export { initScraper, initCalendar };
