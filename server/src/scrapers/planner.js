import { getCookies, cookieHeader } from "./login.js";
import { parsePlanner } from "../parsers/plannerParser.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const ACADEMIA_PAGE_BASE =
  "https://academia.srmist.edu.in/srm_university/academia-academic-services/page/";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36";

const plannerLinkPattern = /Academic_Planner_[A-Za-z0-9_]+/g;

const buildTermUrls = (year, term) => {
  const shortNext = String((year + 1) % 100).padStart(2, "0");
  return [
    `${ACADEMIA_PAGE_BASE}Academic_Planner_${year}_${shortNext}_${term}`,
    `${ACADEMIA_PAGE_BASE}Academic_Planner_${year}_${year + 1}_${term}`,
  ];
};

/** Prefer stable report pages, then current/adjacent term planners (ClassPro cascade). */
const calendarPageUrls = (now = new Date()) => {
  const urls = [];
  const seen = new Set();
  const add = (...list) => {
    for (const url of list) {
      if (!seen.has(url)) {
        seen.add(url);
        urls.push(url);
      }
    }
  };

  add(
    `${ACADEMIA_PAGE_BASE}Academic_Reports`,
    `${ACADEMIA_PAGE_BASE}Academic_Reports_Unified`,
    `${ACADEMIA_PAGE_BASE}Academic_Calendar`,
    `${ACADEMIA_PAGE_BASE}Day_Order`
  );

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const isOdd = month >= 6;
  const academicYear = isOdd ? year : year - 1;
  const primary = isOdd ? "ODD" : "EVEN";
  const secondary = isOdd ? "EVEN" : "ODD";

  add(...buildTermUrls(academicYear, primary));
  add(...buildTermUrls(academicYear, secondary));
  add(...buildTermUrls(academicYear + 1, "ODD"));
  add(...buildTermUrls(academicYear + 1, "EVEN"));
  add(...buildTermUrls(academicYear - 1, "EVEN"));
  add(...buildTermUrls(academicYear - 1, "ODD"));
  add(`${ACADEMIA_PAGE_BASE}Academic_Planner`);

  return urls;
};

const discoverPlannerUrls = (body) => {
  const matches = body.match(plannerLinkPattern) || [];
  const urls = [];
  const seen = new Set();
  for (const name of matches) {
    if (seen.has(name)) continue;
    seen.add(name);
    urls.push(`${ACADEMIA_PAGE_BASE}${name}`);
  }
  return urls;
};

const fetchPlannerPage = async (url, cookieStr) => {
  const response = await axios.get(url, {
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      Connection: "keep-alive",
      Referer: "https://academia.srmist.edu.in/",
      "User-Agent": USER_AGENT,
      "X-Requested-With": "XMLHttpRequest",
      Cookie: cookieStr,
    },
    validateStatus: () => true,
  });
  return { status: response.status, body: String(response.data ?? "") };
};

const automatePlanner = async (job) => {
  try {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    console.log("Getting Planner");
    job?.log?.("Getting Planner");

    const cookiesObj = await getCookies(email, password);
    const cookieStr = cookiesObj.cookieString || cookieHeader(cookiesObj);

    const urls = calendarPageUrls();
    let lastErr = "no academic calendar URL succeeded";

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        const { status, body } = await fetchPlannerPage(url, cookieStr);
        if (status !== 200) {
          lastErr = `HTTP ${status} for ${url}`;
          console.log(lastErr);
          job?.log?.(lastErr);
          continue;
        }

        for (const discovered of discoverPlannerUrls(body)) {
          if (!urls.includes(discovered)) urls.push(discovered);
        }

        const planner = parsePlanner(body);
        if (!planner || Object.keys(planner).length === 0) {
          lastErr = `empty calendar from ${url}`;
          console.log(lastErr);
          job?.log?.(lastErr);
          continue;
        }

        const msg = `Using planner page ${url} (${Object.keys(planner).length} days)`;
        console.log(msg);
        job?.log?.(msg);
        return planner;
      } catch (err) {
        lastErr = `${url}: ${err.message}`;
        console.log(lastErr);
        job?.log?.(lastErr);
      }
    }

    throw new Error(lastErr);
  } catch (error) {
    console.error("An error occurred:", error.message);
    throw error;
  }
};

export default automatePlanner;
export { calendarPageUrls, discoverPlannerUrls };
