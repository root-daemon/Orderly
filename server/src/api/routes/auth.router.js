import { Router } from "express";
import {
  login,
  logout,
  redirect,
  verify,
} from "../controllers/auth.controller.js";
import { getTimetable2, getPlanner } from "../controllers/api.controller.js";

import { getCookies } from "../../scrapers/login.js";

const router = Router();

router.get("/", login);
router.get("/redirect", redirect);
router.get("/logout", logout);
router.get("/verify", verify);

router.post("/timetable", getTimetable2);
router.post("/planner", getPlanner);

router.post("/get-cookies", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await getCookies(email, password);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in get-cookies route:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
