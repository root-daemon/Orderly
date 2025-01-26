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

  return await getDayOrder(page, job);
};

const automateLogin = async (job) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1080, height: 1024 },
      args: ["--disable-features=site-per-process"],
    });

    const page = await browser.newPage();

    const cookies = await loadCookies();

    browser.setCookie(...cookies);

    console.log("Set Cookies");

    await page.goto("https://academia.srmist.edu.in", {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    const isLoggedIn = await page
      .evaluate(() => document.querySelector(".highlight"))
      .catch(() => false);

    if (isLoggedIn) {
      job.log("Logged in using existing cookies.");
      console.log("Logged in using existing cookies.");
      return await getDayOrder(page, job);
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

const getDayOrder = async (page, job) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const dayOrders = await page.$$eval(".highlight", (elements) =>
      elements.map((el) => el.innerText.trim())
    );

    job.log("Day Orders:", dayOrders);
    console.log("Day Orders:", dayOrders);

    const dayOrderString = dayOrders.find((item) =>
      item.startsWith("Day Order:")
    );

    const dayOrderNumber =
      dayOrderString && dayOrderString.match(/\d+/)
        ? parseInt(dayOrderString.match(/\d+/)[0], 10)
        : 0;

    job.log("Successfully fetched Day Order", dayOrderNumber);
    console.log("Successfully fetched Day Order", dayOrderNumber);

    return dayOrderNumber;
  } catch (error) {
    console.error("An error occurred:", error.message);

    throw error;
  }
};

export default automateLogin;
