import { Router } from "express";
import {
  login,
  logout,
  redirect,
  verify,
} from "../controllers/auth.controller.js";
const router = Router();

router.get("/", login);
router.get("/redirect", redirect);
router.get("/logout", logout);
router.get("/verify", verify);

export default router;
