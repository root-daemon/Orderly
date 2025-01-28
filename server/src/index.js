import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./api/middlewares/errorHandler.js";
import { initBull } from "./config/bull.js";
import adminRouter from "./api/routes/admin.router.js";
import apiRouter from "./api/routes/api.router.js";
import authRouter from "./api/routes/auth.router.js";
import { verifyAdmin } from "./api/middlewares/adminVerification.js";
import { verifyUser } from "./api/middlewares/userVerification.js";
import cookieParser from "cookie-parser";

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

initBull();

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.use("/admin", verifyAdmin, adminRouter);
app.use("/auth", authRouter);
app.use("/api", verifyUser, apiRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started succesfully on port : ${port}`);
});
