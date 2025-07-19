import prisma from "../../../prisma/prisma.client.js";
import { oauth2Client, scopes } from "../../utils/googleUtils.js";
import axios from "axios";
import { DateTime } from "luxon";
import { getCookies } from "../../scrapers/login.js";
import { parseTimetable } from "../../parsers/timetableParser.js";
import { parsePlanner } from "../../parsers/plannerParser.js";

export const createTimetable = async (req, res, next) => {
  try {
    const { email } = req.user;
    const { timetable } = req.body;

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        timetable,
      },
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
      where: {
        email,
      },
      select: {
        email: true,
        timetable: true,
      },
    });

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const scrapeTimetable = async (req, res, next) => {
  req.user.academiaEmail = req.body.email;
  req.user.academiaPassword = req.body.password;
  try {
    const result = await axios.post(
      `${process.env.SERVER_URL}/admin/scrape-timetable`,
      req.user,
      {
        headers: {
          "x-admin-password": process.env.ADMIN_PASSWORD,
        },
        withCredentials: true,
      }
    );
    if (result) {
      res.status(200).json({
        success: true,
        message: "Succesfully scraped timetable from academia",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Could not scrape timetable from academia",
      });
    }
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

    const { dayOrder } = await prisma.academia.findFirst({
      where: {
        date: todayIST,
      },
    });

    res.status(200).json({ success: true, data: dayOrder });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createCalendar = async (req, res, next) => {
  try {
    const result = await axios.post(
      `${process.env.SERVER_URL}/admin/calendar`,
      req.user,
      {
        headers: {
          "x-admin-password": process.env.ADMIN_PASSWORD,
        },
        withCredentials: true,
      }
    );
    if (result) {
      res.status(200).json({
        success: true,
        message: "Succesfully added events to calendar",
      });
    }
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
      where: {
        email,
      },
      data: {
        enabled,
      },
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
      where: {
        email,
      },
      select: {
        enabled: true,
      },
    });

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteCookies = async (req, res, next) => {
  try {
    const { email } = req.user;

    const data = await prisma.user.update({
      where: {
        email,
      },
      data: {
        academiaEmail: null,
        academiaCookies: [],
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAcademiaEmail = async (req, res, next) => {
  try {
    const { email } = req.user;

    const data = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        academiaEmail: true,
      },
    });

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getTimetable2 = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const cookiesObj = await getCookies(email, password);
    const cookieHeader = Object.entries(cookiesObj)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");

    const url =
      "https://academia.srmist.edu.in/srm_university/academia-academic-services/page/My_Time_Table_2023_24";
    const headers = {
      Accept: "*/*",
      "Accept-Language": "en-GB,en;q=0.9",
      Connection: "keep-alive",
      DNT: "1",
      Referer: "https://academia.srmist.edu.in/",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      "X-Requested-With": "XMLHttpRequest",
      Cookie: cookieHeader,
    };

    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      const timetable = parseTimetable(response.data);
      return res.status(200).json(timetable);
    } else {
      return res.status(response.status).json({
        error: "Failed to fetch timetable data",
        status_code: response.status,
      });
    }
  } catch (error) {
    console.error("Error in getTimetable:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const getPlanner = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const cookiesObj = await getCookies(email, password);
    const cookieHeader = Object.entries(cookiesObj)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");

    const url =
      "https://academia.srmist.edu.in/srm_university/academia-academic-services/page/Academic_Planner_2025_26_ODD";
    const headers = {
      Accept: "*/*",
      "Accept-Language": "en-GB,en;q=0.9",
      Connection: "keep-alive",
      DNT: "1",
      Referer: "https://academia.srmist.edu.in/",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      "X-Requested-With": "XMLHttpRequest",
      Cookie: cookieHeader,
    };

    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      const timetable = parsePlanner(response.data);
      return res.status(200).json(timetable);
    } else {
      return res.status(response.status).json({
        error: "Failed to fetch timetable data",
        status_code: response.status,
      });
    }
  } catch (error) {
    console.error("Error in getTimetable:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
