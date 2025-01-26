import { Router } from "express";
import {
  scrapeController,
  calendarController,
} from "../controllers/admin.controller.js";
import { serverAdapter } from "../../bull/bullBoard.js";
import { verifyAdmin } from "../middlewares/adminVerification.js";
const router = Router();

router.use("/dashboard", serverAdapter.getRouter());
router.get("/scrape", scrapeController);
router.get("/calendar", calendarController);

export default router;
