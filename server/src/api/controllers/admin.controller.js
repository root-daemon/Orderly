import prisma from "../../../prisma/prisma.client.js";
import { encrypt } from "../../utils/crypto.js";
import {
  scrapeProcedure,
  calendarProcedure,
} from "../../bull/procedure.js";

const makeJob = (data) => ({
  data,
  log: (...args) => console.log("[job]", ...args),
});

export const scrapePlanner = async (req, res, next) => {
  try {
    await scrapeProcedure(makeJob({ type: "scrape planner" }));

    // After planner refresh, sync calendars for enabled users
    const users = await prisma.user.findMany({ where: { enabled: true } });
    for (const user of users) {
      if (!user.refreshToken) continue;
      try {
        await calendarProcedure(makeJob({ type: "calendar", user }));
      } catch (err) {
        console.error(`Calendar sync failed for ${user.email}:`, err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Scraped planner and synced enabled calendars",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const scrapeTimetable = async (req, res, next) => {
  const { email, academiaEmail, academiaPassword } = req.body;

  try {
    const encryptedPassword = encrypt(academiaPassword);

    await scrapeProcedure(
      makeJob({
        type: "scrape timetable",
        user: {
          email,
          academiaEmail,
          encryptedPassword,
        },
      })
    );

    res.status(200).json({
      success: true,
      message: "Succesfully scraped timetable",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const calendarController = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { enabled: true },
    });

    for (const user of users) {
      if (!user.refreshToken) continue;
      await calendarProcedure(makeJob({ type: "calendar", user }));
    }

    res.status(200).json({
      success: true,
      message: "Started",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const singleEvent = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!user.refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Missing Google refresh token — log in again with consent",
      });
    }

    await calendarProcedure(makeJob({ type: "calendar", user }));

    res.status(200).json({
      success: true,
      message: "Started",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
