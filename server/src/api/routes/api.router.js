import { Router } from "express";
import { timetableController } from "../controllers/api.controller.js";
const router = Router();

router.post("/timetable", timetableController);

export default router;
