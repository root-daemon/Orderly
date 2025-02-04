import prisma from "../../prisma/prisma.client.js";
import { google } from "googleapis";
import dotenv from "dotenv";
import generateEvent from "../utils/generateEvent.js";
import {
  addLectureEvents,
  deleteExistingEvents,
  oauth2Client,
} from "../utils/googleUtils.js";
import { DateTime } from "luxon";
import { checkSchedule } from "../utils/data.js";
import automateScrape from "../scrapers/dayOrder.js";
import automatePlanner from "../scrapers/planner.js";
dotenv.config();

export const scrapeProcedure = async (job) => {
  console.log("Initialise Scraper Procedure");
  job.log("Initialise Scraper Procedure");
  if (job.data.type === "scrape" || job.data.type === "scrape single") {
    const dayOrder = await automateScrape(job);
    const todayIST = DateTime.now()
      .setZone("Asia/Kolkata")
      .toFormat("yyyy-MM-dd");

    job.log(todayIST);

    await prisma.academia.upsert({
      where: {
        date: todayIST,
      },
      update: {
        dayOrder,
      },
    });
    return dayOrder;
  } else if (job.data.type === "scrape planner") {
    const planner = await automatePlanner(job);

    for (const [date, dayOrder] of Object.entries(planner)) {
      await prisma.academia.upsert({
        where: { date },
        update: { dayOrder },
        create: { date, dayOrder },
      });
    }
    return planner;
  }
};

export const calendarProcedure = async (job) => {
  console.log("Initialise Calendar Procedure");
  job.log("Initialise Calendar Procedure");

  const user = job.data.user;
  const refreshToken = user.refreshToken;
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  const todayIST = DateTime.now()
    .setZone("Asia/Kolkata")
    .toFormat("yyyy-MM-dd");

  const { dayOrder } = await prisma.academia.findFirst({
    where: {
      date: todayIST,
    },
  });

  if (dayOrder === 0) {
    job.log("No Day Order");
    return;
  }

  job.log("Day Order", dayOrder);

  const lectures = user.timetable[dayOrder];

  if (checkSchedule(user.timetable)) {
    const startOfDay = DateTime.now()
      .setZone("Asia/Kolkata")
      .startOf("day")
      .toISO();
    const endOfDay = DateTime.now()
      .setZone("Asia/Kolkata")
      .endOf("day")
      .toISO();

    await deleteExistingEvents(startOfDay, endOfDay);
    await addLectureEvents(lectures);
  } else {
    return job.log("No lectures found for this use");
  }

  return `Successfully added calendar events for ${user.email}`;
};
