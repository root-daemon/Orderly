import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import dotenv from "dotenv";

dotenv.config();

puppeteer.use(StealthPlugin());

const automateLogin = async (job) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1080, height: 1024 },
      args: ["--disable-features=site-per-process"],
    });

    const page = await browser.newPage();

    await page.goto("https://academia.srmist.edu.in", {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    const iframeElement = await page.waitForSelector("iframe.siginiframe");

    const iframe = await iframeElement.contentFrame();

    const input = await iframe.waitForSelector("#login_id");

    await input.type(process.env.EMAIL);

    const next = await iframe.waitForSelector("#nextbtn");
    next.click();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const password = await iframe.waitForSelector("#password");
    await password.type(process.env.PASSWORD);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0", timeout: 60000 }),
      next.click(),
    ]);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const dayOrders = await page.$$eval(".highlight", (elements) =>
      elements.map((el) => el.innerText.trim())
    );

    job.log("Day Orders:", dayOrders);
    console.log("Day Orders:", dayOrders);

    const dayOrderNumber = dayOrders
      .find((item) => item.startsWith("Day Order:"))
      .match(/\d+/)[0];

    job.log("Successfully fetched Day Order", dayOrderNumber);
    console.log("Successfully fetched Day Order", dayOrderNumber);

    return dayOrderNumber;
  } catch (error) {
    console.error("An error occurred:", error.message);

    throw error;
  } finally {
    if (browser) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await browser.close();
    }
  }
};

export default automateLogin;
