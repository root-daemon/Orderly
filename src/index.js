import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { serverAdapter } from "./bull/bullBoard.js";
import { errorHandler } from "./api/middlewares/errorHandler.js";
import { calendarQueue, scraperQueue } from "./bull/queue.js";
import prisma from "../prisma/prisma.client.js";

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

serverAdapter.setBasePath("/admin");
app.use("/admin", serverAdapter.getRouter());

app.get("/scrape", async (req, res) => {
  try {
    await scraperQueue.add("scraper", {
      type: "scrape",
    });
    res.status(200).json({
      success: true,
      message: "Started",
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/auth", (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
  res.redirect(url);
});

app.get("/auth/redirect", async (req, res) => {
  oauth2Client.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      console.log("FROM LISTENER", tokens.refresh_token);
    }
    console.log("FROM LISTENER", tokens.access_token);
  });

  const { tokens } = await oauth2Client.getToken(req.query.code);

  oauth2Client.setCredentials(tokens);

  const accessToken = tokens.access_token || null;
  const refreshToken = tokens.refresh_token || null;

  const { email } = await oauth2Client.getTokenInfo(tokens.access_token);

  await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      accessToken,
    },
    create: {
      email,
      accessToken,
      refreshToken,
    },
  });

  console.log("User's Email:", email);

  res.send(`Authentication successful! Welcome (${email}).`);
});

app.post("/timetable", async (req, res) => {
  const { email, timetable } = req.body;

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      timetable,
    },
  });

  res.send(`Added timetable`);
});

app.get("/calendar", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    await calendarQueue.add("scraper", {
      type: "scrape",
    });
    res.status(200).json({
      success: true,
      message: "Started",
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }

  return;
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started succesfully on port : ${port}`);
});
