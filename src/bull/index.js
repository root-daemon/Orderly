import dotenv from "dotenv";
import { initScraper } from "./worker.js";

dotenv.config();

const init = async () => {
  console.log("Worker started!!!!");
  initScraper();
};

init();
