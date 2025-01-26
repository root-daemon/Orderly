import dotenv from "dotenv";
import { initCalendar, initScraper } from "./worker.js";

dotenv.config();

const init = async () => {
  console.log("Worker started");
  initScraper();
  initCalendar();
};

init();
