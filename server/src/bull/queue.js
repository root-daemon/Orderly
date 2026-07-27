import { Queue, QueueEvents } from "bullmq";
import { getRedisConnection } from "../config/redis.js";

const connection = getRedisConnection();

const scraperQueue = new Queue("scraper", {
  connection,
  defaultJobOptions: {
    attempts: 1,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: false,
    removeOnFail: 1000,
    timeout: 15 * 60 * 1000,
  },
});

const scraperQueueEvents = new QueueEvents("scraper", {
  connection,
});

const calendarQueue = new Queue("calendar", {
  connection,
  defaultJobOptions: {
    attempts: 1,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: false,
    removeOnFail: 1000,
    timeout: 15 * 60 * 1000,
  },
});

const calendarQueueEvents = new QueueEvents("calendar", {
  connection,
});

export { scraperQueue, scraperQueueEvents, calendarQueue, calendarQueueEvents };
