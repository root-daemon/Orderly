import axios from "axios";
import * as cheerio from "cheerio";

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36";
const SIGNIN_URL = "https://academia.srmist.edu.in/accounts/signin.ac";

const mergeCookies = (jar, setCookieHeaders = []) => {
  for (const header of setCookieHeaders) {
    const [pair] = header.split(";");
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    const name = pair.slice(0, eq).trim();
    const value = pair.slice(eq + 1).trim();
    if (!name || !value || value === "delete" || value === "null") continue;
    jar[name] = value;
  }
};

const cookieHeader = (jar) =>
  Object.entries(jar)
    .filter(([k]) => k !== "cookieString")
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

const normalizeUsername = (username) =>
  username.includes("@") ? username : `${username}@srmist.edu.in`;

const forceLogout = async (html, jar) => {
  const $ = cheerio.load(html);
  let terminateForm = null;
  $("form").each((_, el) => {
    if ($(el).text().toLowerCase().includes("terminate")) {
      terminateForm = $(el);
    }
  });
  if (!terminateForm) return false;

  let action = terminateForm.attr("action") || "";
  if (!action.startsWith("http")) {
    action = `https://academia.srmist.edu.in${action}`;
  }

  const params = new URLSearchParams();
  terminateForm.find("input").each((_, el) => {
    const name = $(el).attr("name");
    if (name) params.append(name, $(el).attr("value") || "");
  });

  const response = await axios.post(action, params.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookieHeader(jar),
      "User-Agent": USER_AGENT,
    },
    maxRedirects: 0,
    validateStatus: () => true,
  });
  mergeCookies(jar, response.headers["set-cookie"]);
  return response.status === 200;
};

const followAuthRedirect = async (url, jar) => {
  let currentUrl = url;
  for (let i = 0; i < 10; i++) {
    const response = await axios.get(currentUrl, {
      headers: {
        Cookie: cookieHeader(jar),
        "User-Agent": USER_AGENT,
        Referer: "https://academia.srmist.edu.in/",
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });
    mergeCookies(jar, response.headers["set-cookie"]);

    const location = response.headers.location;
    if (!location || (response.status !== 301 && response.status !== 302 && response.status !== 303 && response.status !== 307 && response.status !== 308)) {
      return;
    }
    currentUrl = location.startsWith("http")
      ? location
      : new URL(location, currentUrl).toString();
  }
};

const loginWithRetry = async (
  username,
  password,
  { cdigest, captcha } = {},
  retryCount = 0,
  jar = {}
) => {
  if (retryCount > 2) {
    throw new Error("Too many retries after concurrent session termination");
  }

  const params = new URLSearchParams({
    username,
    password,
    client_portal: "true",
    portal: "10002227248",
    servicename: "ZohoCreator",
    serviceurl: "https://academia.srmist.edu.in/",
    is_ajax: "true",
    grant_type: "password",
    service_language: "en",
  });
  if (cdigest) params.append("cdigest", cdigest);
  if (captcha) params.append("captcha", captcha);

  const response = await axios.post(SIGNIN_URL, params.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": USER_AGENT,
      Origin: "https://academia.srmist.edu.in",
      Referer: "https://academia.srmist.edu.in/",
      Cookie: cookieHeader(jar),
    },
    maxRedirects: 0,
    validateStatus: () => true,
  });
  mergeCookies(jar, response.headers["set-cookie"]);

  const bodyText =
    typeof response.data === "string"
      ? response.data
      : JSON.stringify(response.data);
  const lower = bodyText.toLowerCase();

  if (lower.includes("concurrent") || lower.includes("terminate")) {
    const html =
      typeof response.data === "string"
        ? response.data
        : bodyText;
    if (await forceLogout(html, jar)) {
      return loginWithRetry(
        username,
        password,
        { cdigest, captcha },
        retryCount + 1,
        jar
      );
    }
  }

  let data = response.data;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      throw new Error("Unexpected response from Academia login");
    }
  }

  if (data?.error) {
    const errMsg =
      data.error.msg ||
      data.error.password ||
      data.error.username ||
      (typeof data.error === "string" ? data.error : JSON.stringify(data.error));
    throw new Error(errMsg || "Academia login error");
  }

  if (data?.status === "fail") {
    if (data.code === "HIP_REQUIRED" || data.code === "HIP_FAILED") {
      const err = new Error(
        data.message || "Academia captcha required — try again later"
      );
      err.captcha = {
        cdigest: data.cdigest,
        image: data.cdigest
          ? `https://academia.srmist.edu.in/accounts/p/40-10002227248/webclient/v1/captcha/${data.cdigest}?darkmode=false`
          : null,
      };
      throw err;
    }
    throw new Error(data.message || "Academia login failed");
  }

  const inner = data?.data;
  if (!inner?.access_token || !inner?.oauthorize_uri) {
    throw new Error(data?.message || "Invalid Academia credentials");
  }

  const finalAuthUrl = `${inner.oauthorize_uri}&access_token=${inner.access_token}`;
  await followAuthRedirect(finalAuthUrl, jar);

  if (!jar.JSESSIONID) {
    throw new Error("Session failed: JSESSIONID not established");
  }

  return jar;
};

/**
 * Logs into SRM Academia and returns a cookie map (compatible with existing scrapers).
 * Also attaches `.cookieString` for callers that prefer a header value.
 */
const getCookies = async (email, password, captchaOpts = {}) => {
  const jar = await loginWithRetry(
    normalizeUsername(email),
    password,
    captchaOpts
  );
  jar.cookieString = cookieHeader(jar);
  return jar;
};

export { getCookies, cookieHeader };
