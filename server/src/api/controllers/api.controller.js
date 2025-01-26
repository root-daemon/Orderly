import prisma from "../../../prisma/prisma.client.js";
import { oauth2Client, scopes } from "../../utils/googleUtils.js";

export const authController = (req, res, next) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      //   prompt: "consent",
    });

    res.redirect(url);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const redirectController = async (req, res, next) => {
  try {
    const { tokens } = await oauth2Client.getToken(req.query.code);

    oauth2Client.setCredentials(tokens);

    const accessToken = tokens.access_token || null;
    const refreshToken = tokens.refresh_token || null;

    const { email } = await oauth2Client.getTokenInfo(tokens.access_token);

    await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        accessToken,
      },
      create: {
        email,
        accessToken,
        refreshToken,
      },
    });

    console.log("User's Email:", email);

    res.status(200).json({
      success: true,
      message: "User authenticated succesfully",
      data: {
        email,
        accessToken,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const timetableController = async (req, res) => {
  try {
    const { email, timetable } = req.body;

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
