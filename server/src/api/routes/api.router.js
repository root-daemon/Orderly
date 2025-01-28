import { Router } from "express";
import {
  createTimetable,
  getTimetable,
} from "../controllers/api.controller.js";
const router = Router();

router.post("/timetable", createTimetable);
router.get("/timetable", getTimetable);

export default router;
