import { getCookies, cookieHeader as toCookieHeader } from "./login.js";
import { parseTimetable } from "../parsers/timetableParser.js";
import dotenv from "dotenv";
import axios from "axios";
import { decrypt } from "../utils/crypto.js";
dotenv.config();

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36";

const TIMETABLE_URLS = [
  "https://academia.srmist.edu.in/srm_university/academia-academic-services/page/My_Time_Table_2023_24",
  "https://academia.srmist.edu.in/srm_university/academia-academic-services/page/My_Time_Table",
];

const automateTimetableScrape = async (job) => {
  try {
    const email = job.data.user.academiaEmail;
    const decryptedPassword = decrypt(job.data.user.encryptedPassword);

    const cookiesObj = await getCookies(email, decryptedPassword);
    const cookieStr = cookiesObj.cookieString || toCookieHeader(cookiesObj);

    const headers = {
      Accept: "*/*",
      "Accept-Language": "en-GB,en;q=0.9",
      Connection: "keep-alive",
      Referer: "https://academia.srmist.edu.in/",
      "User-Agent": USER_AGENT,
      "X-Requested-With": "XMLHttpRequest",
      Cookie: cookieStr,
    };

    let lastErr = "Failed to fetch timetable data";
    for (const url of TIMETABLE_URLS) {
      const response = await axios.get(url, {
        headers,
        validateStatus: () => true,
      });
      if (response.status !== 200) {
        lastErr = `HTTP ${response.status} for ${url}`;
        continue;
      }
      const timetable = parseTimetable(response.data);
      if (timetable?.courses?.length) {
        return { batch: timetable.batch, courses: timetable.courses };
      }
      lastErr = `empty timetable from ${url}`;
    }
    throw new Error(lastErr);
  } catch (error) {
    console.error("Error in getTimetable:", error.message);
    throw error;
  }
};

export default automateTimetableScrape;