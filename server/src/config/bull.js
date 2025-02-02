import { calendarQueue, scraperQueue } from "../bull/queue.js";
import { initCalendar, initScraper } from "../bull/worker.js";

export const initBull = async () => {
  console.log("Worker started");
  initScraper();
  initCalendar();
  await scraperQueue.add(
    "Scrape Academia",
    {
      type: "scrape",
    },
    {
      repeat: {
        cron: "1 5 * * *",
      },
    }
  );
  // Bull will not add a duplicate repeatable job unless the repeat identifier changes.
};
