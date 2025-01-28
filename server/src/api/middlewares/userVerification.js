import prisma from "../../../prisma/prisma.client.js";
import { oauth2Client } from "../../utils/googleUtils.js";

export const verifyUser = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    const { email } = await oauth2Client.getTokenInfo(accessToken);

    req.user = { email, accessToken };
    console.log("Access token verified");

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Unauthorised.",
    });
  }
};
