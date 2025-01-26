import prisma from "../../../prisma/prisma.client.js";
import { oauth2Client } from "../../utils/googleUtils.js";

export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const userEmail = req.body.email;
    console.log(userEmail);
    const token = authHeader?.split(" ")[1];
    if (!token || !authHeader) {
      throw {
        statusCode: 401,
        message: "Missing Access Token",
      };
    }
    const { email } = await oauth2Client.getTokenInfo(token);

    if (email !== userEmail) {
      console.log("Could not verify");
      throw {
        statusCode: 403,
        message: "Unauthorised",
      };
    }
    console.log("Email Verified");

    next();
  } catch (error) {
    next(error);
  }
};
