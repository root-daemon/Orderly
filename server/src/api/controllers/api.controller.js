import prisma from "../../../prisma/prisma.client.js";
import { oauth2Client, scopes } from "../../utils/googleUtils.js";

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
    console.log(email);

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
