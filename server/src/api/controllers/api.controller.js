import prisma from "../../../prisma/prisma.client.js";
import { oauth2Client, scopes } from "../../utils/googleUtils.js";
import axios from "axios";

export const createTimetable = async (req, res) => {
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

    res.send(`Added timetable`);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getTimetable = async (req, res) => {
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

export const createCalendar = async (req, res) => {
  try {
    await axios.post(`${process.env.SERVER_URL}/admin/calendar`, req.user, {
      headers: {
        "x-admin-password": process.env.ADMIN_PASSWORD,
      },
      withCredentials: true,
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
