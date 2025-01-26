import { calendarQueue, scraperQueue } from "../../bull/queue.js";
import prisma from "../../../prisma/prisma.client.js";

export const scrapeController = async (req, res, next) => {
  try {
    await scraperQueue.add("Scrape Academia", {
      type: "scrape",
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

export const calendarController = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        timetable: {
          not: null,
        },
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
