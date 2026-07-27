import * as cheerio from "cheerio";

function convertHexEscapes(escapedHtml) {
  return escapedHtml
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\\x([0-9A-Fa-f]{2})/g, (_, g1) =>
      String.fromCharCode(parseInt(g1, 16))
    )
    .replace(/\\u([0-9A-Fa-f]{4})/g, (_, g1) =>
      String.fromCharCode(parseInt(g1, 16))
    )
    .replace(/\\\//g, "/")
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "");
}

function extractSanitizedHtml(htmlSnippet) {
  if (htmlSnippet.includes("<table bgcolor=")) {
    return htmlSnippet;
  }

  if (htmlSnippet.includes(".sanitize('")) {
    const parts = htmlSnippet.split(".sanitize('");
    if (parts.length >= 2) {
      const htmlHex = parts[1].split("')")[0];
      return convertHexEscapes(htmlHex);
    }
  }

  const $ = cheerio.load(htmlSnippet);
  const zmlDiv = $("[zmlvalue]");
  if (zmlDiv.length) {
    const escapedHtml = zmlDiv.attr("zmlvalue");
    if (escapedHtml) {
      try {
        return convertHexEscapes(escapedHtml);
      } catch {
        return null;
      }
    }
  }

  if (htmlSnippet.includes('zmlvalue="')) {
    const parts = htmlSnippet.split('zmlvalue="');
    if (parts.length >= 2) {
      const raw = parts[1].split('" > </div> </div>')[0];
      try {
        return convertHexEscapes(raw);
      } catch {
        return null;
      }
    }
  }

  return null;
}

const MONTHS = [
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

/** Parse month header like "Jul '26" / "Jul'26" → { month: "Jul", year: "2026" } */
function parseMonthHeader(text) {
  const match = text.match(/([A-Za-z]+)\s*'(\d{2})/);
  if (!match) return null;
  const month = match[1].slice(0, 3);
  if (!MONTHS.includes(month)) return null;
  const yy = parseInt(match[2], 10);
  const year = String(2000 + yy);
  return { month, year };
}

export const parsePlanner = (html) => {
  let innerHtml = extractSanitizedHtml(html);
  if (innerHtml) {
    html = innerHtml;
  }
  const $ = cheerio.load(html);
  const result = {};

  const months = [];
  $("table th").each((_, header) => {
    const text = $(header).text().trim();
    // Match any 20xx short year ('24, '25, '26, ...) — ClassPro uses "'2"
    if (text.includes("'2")) {
      const parsed = parseMonthHeader(text);
      if (parsed) months.push(parsed);
    }
  });

  const rows = $("table tbody tr").length
    ? $("table tbody tr")
    : $("table tr");

  rows.each((_, row) => {
    const cells = $(row).find("td");
    for (let i = 0; i < months.length; i++) {
      const dateIndex = i * 5;
      const doIndex = i * 5 + 3;
      if (!cells.eq(dateIndex).length || !cells.eq(doIndex).length) continue;

      const date = cells.eq(dateIndex).text().trim();
      const doValue = cells.eq(doIndex).text().trim();
      if (!date) continue;

      const monthIndex = MONTHS.indexOf(months[i].month) + 1;
      const formattedDate = `${months[i].year}-${String(monthIndex).padStart(
        2,
        "0"
      )}-${date.padStart(2, "0")}`;
      const parsedDoValue = doValue === "-" ? 0 : parseInt(doValue, 10) || 0;
      result[formattedDate] = parsedDoValue;
    }
  });

  return result;
};
