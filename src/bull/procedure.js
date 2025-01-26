import prisma from "../../prisma/prisma.client.js";
import automateLogin from "../scrapers/dayOrder.js";
import { google } from "googleapis";
import dotenv from "dotenv";
import prisma from "../prisma/prisma.client.js";
import generateEvent from "./utils/generateEvent.js";

dotenv.config();

export const scrapeProcedure = async (job) => {
  console.log("Initialise Scraper Procedure");
  job.log("Initialise Scraper Procedure");
  let dayOrder = await automateLogin(job);
  dayOrder = parseInt(dayOrder);
  await prisma.academia.create({
    data: {
      dayOrder,
    },
  });
  return dayOrder;
};

export const calendarProcedure = async (job, user, dayOrder) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

  const refreshToken = user.refreshToken;
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  const date = new Date().toISOString();
  const { dayOrder } = await prisma.academia.findFirst({
    where: {
      date,
    },
  });

  const lectures = user.timetable[dayOrder];

  await Promise.all(
    lectures.map(async (lecture) => {
      const event = generateEvent(lecture.subject, lecture.start, lecture.end);

      await calendar.events.insert({
        calendarId: "primary",
        auth: oauth2Client,
        resource: event,
      });
    })
  );
};
