import prisma from "../../../prisma/prisma.client.js";
import { mockTimetable } from "../../utils/data.js";
import { oauth2Client, scopes } from "../../utils/googleUtils.js";
import dotenv from "dotenv";

dotenv.config();

export const login = (req, res, next) => {
  try {
    const data = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      // prompt: "consent",
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const redirect = async (req, res, next) => {
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
        timetable: mockTimetable,
        enabled: false,
      },
    });

    const redirectUrl = `${process.env.CLIENT_URL}/dashboard`;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
    // res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    console.error("Error during logout:", error);
    res
      .status(500)
      .json({ success: false, message: "An error occurred during logout" });
  }
};

export const verify = async (req, res, next) => {
  const { accessToken } = req.cookies;
  const { email } = req.user || "";

  try {
    const { email } = await oauth2Client.getTokenInfo(accessToken);

    req.user = { email };
    res.status(200).json({ success: true, email });
  } catch (err) {
    console.error("Error verifying user", err);
    next(err);
  }
};
