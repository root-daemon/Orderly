import { Router } from "express";
import {
  calendarController,
  singleEvent,
  scrapePlanner,
  scrapeTimetable,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/scrape-planner", scrapePlanner);
router.post("/scrape-timetable", scrapeTimetable);
router.get("/calendar", calendarController);
router.post("/calendar", singleEvent);

export default router;
