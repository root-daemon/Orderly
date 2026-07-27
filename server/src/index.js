import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./api/middlewares/errorHandler.js";
import adminRouter from "./api/routes/admin.router.js";
import apiRouter from "./api/routes/api.router.js";
import authRouter from "./api/routes/auth.router.js";
import { verifyAdmin } from "./api/middlewares/adminVerification.js";
import { verifyUser } from "./api/middlewares/userVerification.js";
import cookieParser from "cookie-parser";
import { scrapePlanner } from "./api/controllers/admin.controller.js";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

// Vercel Cron hits this daily (see vercel.json)
app.get("/api/cron/daily", async (req, res, next) => {
  const auth = req.headers.authorization || "";
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  // Reuse admin scrapePlanner (planner + enabled calendar sync)
  req.headers["x-admin-password"] = process.env.ADMIN_PASSWORD;
  return scrapePlanner(req, res, next);
});

app.use("/admin", verifyAdmin, adminRouter);
app.use("/auth", authRouter);
app.use("/api", verifyUser, apiRouter);

app.use(errorHandler);

// Local / Docker / Render: start listening. Vercel imports the app as a function.
if (!process.env.VERCEL) {
  // Optional BullMQ workers when Redis is configured
  if (process.env.REDIS_URL || process.env.REDIS_HOST) {
    import("./config/bull.js")
      .then(({ initBull }) => initBull())
      .catch((err) => console.warn("Bull init skipped:", err.message));
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server started succesfully on port : ${port}`);
  });
}

export default app;
