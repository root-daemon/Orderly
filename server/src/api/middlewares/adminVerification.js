import dotenv from "dotenv";

dotenv.config();

export const verifyAdmin = (req, res, next) => {
  const adminPassword = req.headers["x-admin-password"];

  if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({
      success: false,
      message: "Invalid Password.",
    });
  }

  next();
};
