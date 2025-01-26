import { Queue } from "bullmq";

const scraperQueue = new Queue("scraper", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: false,
    removeOnFail: 1000,
    timeout: 15 * 60 * 1000,
  },
});

const calendarQueue = new Queue("calendar", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: false,
    removeOnFail: 1000,
    timeout: 15 * 60 * 1000,
  },
});

export { scraperQueue, calendarQueue };
