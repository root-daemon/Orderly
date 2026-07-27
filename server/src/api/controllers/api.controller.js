import prisma from "../../../prisma/prisma.client.js";
import { encrypt } from "../../utils/crypto.js";
import {
  scrapeProcedure,
  calendarProcedure,
} from "../../bull/procedure.js";
import { DateTime } from "luxon";

export const createTimetable = async (req, res, next) => {
  try {
    const { email } = req.user;
    const { timetable } = req.body;

    await prisma.user.update({
      where: { email },
      data: { timetable },
    });

    res
      .status(200)
      .json({ success: true, message: "Updated timetable succesfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getTimetable = async (req, res, next) => {
  try {
    const { email } = req.user;

    const data = await prisma.user.findUnique({
      where: { email },
      select: { email: true, timetable: true },
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const scrapeTimetable = async (req, res, next) => {
  try {
    const { email } = req.user;
    const academiaEmail = req.body.email;
    const academiaPassword = req.body.password;
    const encryptedPassword = encrypt(academiaPassword);

    await scrapeProcedure({
      data: {
        type: "scrape timetable",
        user: { email, academiaEmail, encryptedPassword },
      },
      log: (...args) => console.log("[job]", ...args),
    });

    res.status(200).json({
      success: true,
      message: "Succesfully scraped timetable from academia",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getDayOrder = async (req, res, next) => {
  try {
    const todayIST = DateTime.now()
      .setZone("Asia/Kolkata")
      .toFormat("yyyy-MM-dd");

    const academiaRecord = await prisma.academia.findFirst({
      where: { date: todayIST },
    });

    const dayOrder = academiaRecord?.dayOrder || null;
    res.status(200).json({ success: true, data: dayOrder });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createCalendar = async (req, res, next) => {
  try {
    const { email } = req.user;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Missing Google refresh token — log in again with consent",
      });
    }

    await calendarProcedure({
      data: { type: "calendar", user },
      log: (...args) => console.log("[job]", ...args),
    });

    res.status(200).json({
      success: true,
      message: "Succesfully added events to calendar",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { email } = req.user;
    const { enabled } = req.body;

    await prisma.user.update({
      where: { email },
      data: { enabled },
    });

    res.status(200).json({
      success: true,
      message: "Updated job succesfully",
      data: enabled,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getJobStatus = async (req, res, next) => {
  try {
    const { email } = req.user;

    const data = await prisma.user.findUnique({
      where: { email },
      select: { enabled: true },
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAcademiaEmail = async (req, res, next) => {
  try {
    const { email } = req.user;

    const data = await prisma.user.findUnique({
      where: { email },
      select: { academiaEmail: true },
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
