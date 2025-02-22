import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import dotenv from "dotenv";
import { decrypt } from "../utils/crypto.js";
dotenv.config();

puppeteer.use(StealthPlugin());

let storedCookies = [];

const login = async (page, job) => {
  const iframeElement = await page.waitForSelector("iframe.siginiframe");

  const iframe = await iframeElement.contentFrame();

  const input = await iframe.waitForSelector("#login_id");

  await input.type(job.data.user.academiaEmail);

  const next = await iframe.waitForSelector("#nextbtn");
  next.click();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const password = await iframe.waitForSelector("#password");
  const decryptedPassword = decrypt(job.data.user.encryptedPassword);

  await password.type(decryptedPassword);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 60000 }),
    next.click(),
  ]);

  const terminateButton = await page.$("#continue_button");
  if (terminateButton) {
    await terminateButton.click();
    await new Promise((r) => setTimeout(r, 10000));

    const confirmButton = await page.$(".confirm-delete_btn");
    if (confirmButton) {
      await confirmButton.click();
      await new Promise((r) => setTimeout(r, 10000));
    }
  }

  const newCookies = await page.cookies();
  storedCookies = newCookies;
  console.log("Cookies saved.");

  return await scrapeTimetable(page, job);
};

const automateTimetableScrape = async (job) => {
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

    const cookies = job.data.user.academiaCookies || [];
    storedCookies = job.data.user.cookies;

    browser.setCookie(...cookies);

    console.log("Set Cookies");

    await page.goto(
      "https://academia.srmist.edu.in/#Page:My_Time_Table_2023_24",
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
      return await scrapeTimetable(page, job);
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

const scrapeTimetable = async (page, job) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const batch = await page.evaluate(() => {
      const batchElement = document.querySelector(
        "tbody tr:nth-child(2) td:nth-child(2) strong font"
      );
      return batchElement ? batchElement.innerText.trim() : "Batch not found";
    });

    job.log("Batch:", batch);
    console.log("Batch:", batch);

    const courses = await page.evaluate(() => {
      let rows = Array.from(
        document.querySelectorAll(".course_tbl tbody tr")
      ).slice(1);
      return rows.map((row) => {
        let columns = row.querySelectorAll("td");
        return {
          courseTitle: columns[2]?.innerText.trim() || "N/A",
          slot: columns[8]?.innerText.trim() || "N/A",
        };
      });
    });

    console.log("Courses:", courses);

    return { batch, courses, storedCookies };
  } catch (error) {
    console.error("An error occurred:", error.message);

    throw error;
  }
};

export default automateTimetableScrape;
