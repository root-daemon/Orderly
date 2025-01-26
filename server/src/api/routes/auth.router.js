import { Router } from "express";
import {
  authController,
  redirectController,
} from "../controllers/api.controller.js";
const router = Router();

router.get("/", authController);
router.get("/redirect", redirectController);

export default router;
