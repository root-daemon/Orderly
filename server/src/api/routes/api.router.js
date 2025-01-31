import { Router } from "express";
import {
  createTimetable,
  getTimetable,
  createCalendar,
  getDayOrder
} from "../controllers/api.controller.js";
const router = Router();

router.post("/timetable", createTimetable);
router.get("/timetable", getTimetable);
router.get("/dayorder", getDayOrder);
router.post("/calendar", createCalendar);

export default router;
