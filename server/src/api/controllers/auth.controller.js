import prisma from "../../../prisma/prisma.client.js";
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
      },
    });

    const redirectUrl = `${process.env.CLIENT_URL}/dashboard`;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
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
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
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
    console.log("ERROR MESSAGE", err.message);
    if (
      err.message === "invalid_token" ||
      err.message === "Token has expired"
    ) {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.refreshToken) {
          return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });
        }

        const { tokens } = await oauth2Client.refreshToken(user.refreshToken);

        await prisma.user.update({
          where: { email: req.body.email },
          data: {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token || user.refreshToken,
          },
        });

        res.cookie("accessToken", tokens.access_token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });

        req.user = { email: req.body.email };
        return res
          .status(401)
          .json({ success: true, message: "User Verified" });
      } catch (err) {
        console.error("Failed to refresh access token:", err);
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  }
};
