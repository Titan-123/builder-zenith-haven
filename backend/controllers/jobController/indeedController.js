const { chromium } = require("playwright");

const fetchIndeedJobs = async (req, res) => {
  const { keywords, location } = req.body;
  const pageLimit = 2;
  let jobs = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    for (let pageNum = 0; pageNum < pageLimit; pageNum++) {
      const start = pageNum * 10;
      const url = `https://www.indeed.com/jobs?q=${encodeURIComponent(
        keywords
      )}&l=${encodeURIComponent(location)}&start=${start}`;

      console.log(`🌐 Fetching page ${pageNum + 1}: ${url}`);

      await page.goto(url, { waitUntil: "networkidle" });

      // Wait 2-4 seconds randomly to mimic human behavior
      await page.waitForTimeout(2000 + Math.random() * 2000);

      // Detect CAPTCHA or verification page by text
      const isCaptcha = await page
        .locator("text=Additional Verification Required")
        .count();
      if (isCaptcha > 0) {
        console.log("⚠️ CAPTCHA detected, stopping scrape.");
        break;
      }

      try {
        await page.waitForSelector(".job_seen_beacon", { timeout: 10000 });
      } catch {
        console.log(`⚠️ No jobs found on page ${pageNum + 1}`);
        continue;
      }

      const jobsOnPage = await page.$$eval(".job_seen_beacon", (cards) =>
        cards
          .map((card) => {
            const titleElem = card.querySelector("h2.jobTitle span");
            const linkElem = card.querySelector("a");
            const title = titleElem ? titleElem.innerText.trim() : null;
            const href = linkElem ? linkElem.getAttribute("href") : null;
            const link = href ? "https://www.indeed.com" + href : null;

            if (title && link) return { title, link };
            return null;
          })
          .filter(Boolean)
      );

      jobs = jobs.concat(jobsOnPage);
      console.log(
        `✅ Page ${pageNum + 1} processed — ${jobsOnPage.length} jobs found`
      );
    }
  } catch (err) {
    console.error("Error during scraping:", err);
  } finally {
    await browser.close();
  }

  res.json({ jobs });
};

module.exports = { fetchIndeedJobs };
















// const axios = require("axios");
// const cheerio = require("cheerio");

// const fetchIndeedJobs = async (req, res) => {
//   console.log("Fetching jobs from Indeed...");
//   const { keywords, location } = req.body;
//   const pageLimit = 2;
//   let jobs = [];

//   for (let page = 0; page < pageLimit; page++) {
//     const start = page * 10; // Each page has ~10 jobs
//     const indeedURL = `https://www.indeed.com/jobs?q=${encodeURIComponent(
//       keywords
//     )}&l=${encodeURIComponent(location)}&start=${start}`;

//     // Using ScraperAPI
//     const scraperURL = `http://api.scraperapi.com?api_key=${
//       process.env.SCRAPING_API_KEY
//     }&url=${encodeURIComponent(indeedURL)}&ultra_premium=true`;

//     try {
//       console.log(`Fetching page ${page + 1}:`, scraperURL);
//       const { data } = await axios.get(scraperURL);
//       console.log(data)
//       const $ = cheerio.load(data);

//       $(".job_seen_beacon").each((index, element) => {
//         let title = $(element).find("h2.jobTitle span").text().trim();
//         let link = "https://www.indeed.com" + $(element).find("a").attr("href");

//         let company =
//           $(element).find(".companyName").text().trim() ||
//           $(element).find("[data-testid='company-name']").text().trim();

//         let location =
//           $(element).find(".companyLocation").text().trim() ||
//           $(element).find("[data-testid='text-location']").text().trim();

//         let salary =
//           $(element).find(".salary-snippet-container").text().trim() ||
//           $(element).find("[data-testid='attribute-snippet']").text().trim() ||
//           "Not specified";

//         let jobType =
//           $(element)
//             .find(".jobCardReqContainer .jobCardReqItem")
//             .text()
//             .trim() ||
//           $(element).find(".attribute_snippet").text().trim() ||
//           $(element).find("[data-testid='job-type']").text().trim() ||
//           "Not specified";

//         let description =
//           $(element)
//             .find(".job-snippet ul li")
//             .map((i, el) => $(el).text().trim())
//             .get()
//             .join(" ") ||
//           $(element).find(".job-snippet").text().trim() ||
//           $(element).find("[data-testid='job-snippet']").text().trim() ||
//           "No description available";

//         if (title && link) {
//           jobs.push({
//             title,
//             company,
//             location,
//             salary,
//             jobType,
//             description,
//             link,
//           });
//         }
//       });

//       console.log(`Page ${page + 1} fetched, total jobs:`, jobs.length);
//     } catch (error) {
//       console.error(`Error fetching page ${page + 1}:`, error.message);
//     }
//   }

//   res.json({ jobs });
// };

// module.exports = { fetchIndeedJobs };
