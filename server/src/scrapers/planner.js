import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";

dotenv.config();

puppeteer.use(StealthPlugin());

const COOKIES_PATH = path.resolve("./cookies.json");
let cookies = [];

const loadCookies = async () => {
  try {
    const fileContent = await fs.readFile(COOKIES_PATH, "utf-8");
    cookies = JSON.parse(fileContent);
    console.log("Loaded");
    return cookies;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Cookies file not found, creating a new one.");
      await fs.writeFile(COOKIES_PATH, JSON.stringify([], null, 2));
    } else {
      throw error;
    }
  }
};

const login = async (page, job) => {
  const iframeElement = await page.waitForSelector("iframe.siginiframe");

  const iframe = await iframeElement.contentFrame();

  const input = await iframe.waitForSelector("#login_id");

  await input.type(process.env.EMAIL);

  const next = await iframe.waitForSelector("#nextbtn");
  next.click();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const password = await iframe.waitForSelector("#password");
  await password.type(process.env.PASSWORD);

  await new Promise((resolve) => setTimeout(resolve, 3000));

  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 60000 }),
    next.click(),
  ]);

  const newCookies = await page.cookies();
  await fs.writeFile(COOKIES_PATH, JSON.stringify(newCookies, null, 2));
  console.log("Cookies saved.");

  //   return await getDayOrder(page, job);
  return await getPlanner(page, job);
};

const automatePlanner = async (job) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1080, height: 1024 },
      args: [
        "--disable-features=site-per-process",
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

    const page = await browser.newPage();

    const cookies = await loadCookies();

    browser.setCookie(...cookies);

    console.log("Set Cookies");

    await page.goto(
      "https://academia.srmist.edu.in/#Page:Academic_Planner_2024_25_EVEN",
      {
        waitUntil: "networkidle0",
        timeout: 60000,
      }
    );

    const isLoggedIn = await page
      .evaluate(() => !!document.querySelector(".LogoDiv"))
      .catch(() => false);

    if (isLoggedIn) {
      job.log("Logged in using existing cookies.");
      console.log("Logged in using existing cookies.");
      //   return await getDayOrder(page, job);
      return await getPlanner(page, job);
    } else {
      return await login(page, job);
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

const getPlanner = async (page, job) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll("table tbody tr");
      let result = {};

      const headers = document.querySelectorAll("table th");
      let months = [];
      headers.forEach((header) => {
        if (header.innerText.includes("'25")) {
          months.push(header.innerText.replace("'25", "").trim());
        }
      });

      const monthsList = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        for (let i = 0; i < months.length; i++) {
          let dateIndex = i * 5;
          let doIndex = i * 5 + 3;
          if (cells[dateIndex] && cells[doIndex]) {
            let date = cells[dateIndex].innerText.trim();
            let doValue = cells[doIndex].innerText.trim();

            if (date) {
              let year = "2025";
              let monthIndex = monthsList.indexOf(months[i]) + 1;
              let formattedDate = `${year}-${monthIndex
                .toString()
                .padStart(2, "0")}-${date.padStart(2, "0")}`;

              let parsedDoValue =
                doValue === "-" ? 0 : parseInt(doValue, 10) || 0;

              result[formattedDate] = parsedDoValue;
              console.log(formattedDate, parsedDoValue);
            }
          }
        }
      });

      return result;
    });

    job.log(data);

    return data;
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
};

export default automatePlanner;
