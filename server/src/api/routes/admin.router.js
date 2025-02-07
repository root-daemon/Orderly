import { Router } from "express";
import {
  scrapeController,
  calendarController,
  singleEvent,
  scrapePlanner,
  scrapeTimetable,
} from "../controllers/admin.controller.js";
import { serverAdapter } from "../../bull/bullBoard.js";
const router = Router();

router.use("/dashboard", serverAdapter.getRouter());
router.get("/scrape", scrapeController);
router.get("/scrape-planner", scrapePlanner);
router.post("/scrape-timetable", scrapeTimetable);
router.get("/calendar", calendarController);
router.post("/calendar", singleEvent);

export default router;