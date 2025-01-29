import { Router } from "express";
import {
  createTimetable,
  getTimetable,
  createCalendar,
} from "../controllers/api.controller.js";
const router = Router();

router.post("/timetable", createTimetable);
router.get("/timetable", getTimetable);
router.post("/calendar", createCalendar);

export default router;
