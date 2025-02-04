import { Router } from "express";
import {
  scrapeController,
  calendarController,
  singleEvent,
  scrapePlanner,
} from "../controllers/admin.controller.js";
import { serverAdapter } from "../../bull/bullBoard.js";

const router = Router();

router.use("/dashboard", serverAdapter.getRouter());
router.get("/scrape", scrapeController);
router.get("/scrape-planner", scrapePlanner);
router.get("/calendar", calendarController);
router.post("/calendar", singleEvent);

export default router;