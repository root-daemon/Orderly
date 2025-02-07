import { calendarQueue, scraperQueue } from "../../bull/queue.js";
import prisma from "../../../prisma/prisma.client.js";
import { encrypt } from "../../utils/crypto.js";

export const scrapeController = async (req, res, next) => {
  try {
    await scraperQueue.add("Scrape Academia", {
      type: "scrape single",
    });
    res.status(200).json({
      success: true,
      message: "Added scrape jobs to queue",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const scrapePlanner = async (req, res, next) => {
  try {
    await scraperQueue.add("Scrape Academia Planner", {
      type: "scrape planner",
    });
    res.status(200).json({
      success: true,
      message: "Added scrape planner jobs to queue",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const scrapeTimetable = async (req, res, next) => {
  const { email } = req.body;
  const { academiaEmail } = req.body;
  const { academiaPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const { academiaCookies } = user;
    const encryptedPassword = encrypt(academiaPassword);

    await scraperQueue.add("Scrape Academia Timetable", {
      type: "scrape timetable",
      user: {
        email,
        academiaEmail,
        encryptedPassword,
        academiaCookies,
      },
    });

    scraperQueue.on("completed", (job, result) => {
      console.log("SCRAPER QUEUE COMPLETE"); // fix thsi is broken
      return true;
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const calendarController = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        enabled: true,
      },
    });

    for (const user of users) {
      await calendarQueue.add("Add events to calendar", {
        type: "calendar",
        user,
      });
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
    const user = await prisma.user.findUnique({
      where: {
        email,
        // enabled: true,
      },
    });

    const job = await calendarQueue.add("Add single user events to calendar", {
      type: "calendar",
      user,
    });

    // this also broken

    // const result = await job.waitUntilFinished();

    // console.log(`Job with id ${job.id} has completed. Result: ${result}`);
    // console.log("Calendar QUEUE COMPLETE");

    res.status(200).json({
      success: true,
      message: "Started",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
