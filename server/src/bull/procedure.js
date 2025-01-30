import prisma from "../../prisma/prisma.client.js";
import automateLogin from "../scrapers/dayOrder.js";
import { google } from "googleapis";
import dotenv from "dotenv";
import generateEvent from "../utils/generateEvent.js";
import { oauth2Client } from "../utils/googleUtils.js";
import { DateTime } from "luxon";

dotenv.config();

export const scrapeProcedure = async (job) => {
  console.log("Initialise Scraper Procedure");
  job.log("Initialise Scraper Procedure");
  const dayOrder = await automateLogin(job);
  const todayIST = DateTime.now()
    .setZone("Asia/Kolkata")
    .startOf("day")
    .toJSDate();

  job.log(todayIST);

  
  await prisma.academia.create({
    data: {
      date: todayIST,
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

  const todayIST = DateTime.now()
    .setZone("Asia/Kolkata")
    .startOf("day")
    .toJSDate();

  const { dayOrder } = await prisma.academia.findFirst({
    where: {
      date: todayIST,
    },
  });

  if (dayOrder === 0) {
    job.log("No Day Order");
    return;
  }

  const lectures = user.timetable[dayOrder];

  await Promise.all(
    lectures.map(async (lecture) => {
      if (lecture) {
        const event = generateEvent(
          lecture.subject,
          lecture.start,
          lecture.end
        );

        await calendar.events.insert({
          calendarId: "primary",
          auth: oauth2Client,
          resource: event,
        });
      }
    })
  );

  return `Succesfully added calendar events for ${user.email}`;
};
