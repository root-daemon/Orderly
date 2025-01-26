import prisma from "../../prisma/prisma.client.js";
import automateLogin from "../scrapers/dayOrder.js";
import { google } from "googleapis";
import dotenv from "dotenv";
import generateEvent from "../utils/generateEvent.js";
import { oauth2Client } from "../utils/googleUtils.js";

dotenv.config();

export const scrapeProcedure = async (job) => {
  console.log("Initialise Scraper Procedure");
  job.log("Initialise Scraper Procedure");
  const dayOrder = await automateLogin(job);
  await prisma.academia.create({
    data: {
      dayOrder,
    },
  });
  return dayOrder;
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

  const date = new Date().toISOString();
  const { dayOrder } = await prisma.academia.findFirst({
    where: {
      date,
    },
  });

  if (dayOrder === 0) {
    job.log("No Day Order");
    return;
  }

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

  return `Succesfully added calendar events for ${user.email}`;
};
