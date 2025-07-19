// const axios = require("axios");
// const cheerio = require("cheerio");
// const puppeteer = require("puppeteer");
// const puppeteerExtra = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const { chromium } = require("playwright");

// puppeteerExtra.use(StealthPlugin());

// // async function fetchLinkedInJobs(req, res) {
// //   console.log("Fetching LinkedIn jobs...");
// //   try {
// //     const {keywords,location}=req.body
// //     // Note: LinkedIn has strict anti-scraping measures. Consider using their API if possible
// //     const formattedKeywords = keywords.replace(/\s+/g, "%20");
// //     const formattedLocation = location ? location.replace(/\s+/g, "%20") : "";

// //     const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${formattedKeywords}&location=${formattedLocation}`;

// //     const response = await axios.get(url, {
// //       headers: {
// //         "User-Agent":
// //           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
// //       },
// //     });

// //     const $ = cheerio.load(response.data);
// //     const jobs = [];

// //     $("li").each((i, element) => {
// //       const title = $(element).find("h3.base-search-card__title").text().trim();
// //       const company = $(element)
// //         .find("h4.base-search-card__subtitle")
// //         .text()
// //         .trim();
// //       const location = $(element)
// //         .find("span.job-search-card__location")
// //         .text()
// //         .trim();
// //       const url = $(element).find("a.base-card__full-link").attr("href");

// //       if (title && company) {
// //         jobs.push({
// //           title,
// //           company,
// //           location,
// //           url,
// //           source: "LinkedIn",
// //         });
// //       }
// //     });

// //     return jobs;
// //   } catch (error) {
// //     console.error("Error fetching LinkedIn jobs:", error);
// //     throw new Error("Failed to fetch LinkedIn jobs");
// //   }
// // }

// const fetchLinkedInJobs = async (req, res) => {
//   const { keywords, location } = req.body;
//   const jobs = [];
//   const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
//     keywords
//   )}&location=${encodeURIComponent(location)}`;

//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   try {
//     await page.goto(url, { waitUntil: "networkidle2" });

//     // Wait for job cards to load
//     await page.waitForSelector(".base-card");

//     const jobListings = await page.evaluate(() => {
//       const jobsArray = [];
//       document.querySelectorAll(".base-card").forEach((job) => {
//         const title = job
//           .querySelector("h3.base-search-card__title")
//           ?.innerText.trim();
//         const link = job.querySelector("a.base-card__full-link")?.href;
//         const company = job
//           .querySelector("h4.base-search-card__subtitle")
//           ?.innerText.trim();
//         const location = job
//           .querySelector("span.job-search-card__location")
//           ?.innerText.trim();
//         const description = job
//           .querySelector(".job-search-card__snippet")
//           ?.innerText.trim();

//         if (title && link) {
//           jobsArray.push({ title, company, location, description, link });
//         }
//       });
//       console.log(jobsArray)
//       return jobsArray;
//     });

//     jobs.push(...jobListings);
//     console.log(jobs)
//   } catch (error) {
//     console.error("Error fetching LinkedIn jobs:", error);
//   } finally {
//     await browser.close();
//   }

//   res.json({ jobs });
// };

// module.exports = { fetchLinkedInJobs };





































// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// puppeteer.use(StealthPlugin());

// const fetchLinkedInJobs = async (req, res) => {
//   const { keywords, location } = req.body;

//   if (!keywords || !location) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Keywords and location are required." });
//   }

//   const browser = await puppeteer.launch({
//     headless: false, // ✅ run non-headless to test
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });

//   const page = await browser.newPage();

//   try {
//     await page.setUserAgent(
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
//     );

//     const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
//       keywords
//     )}&location=${encodeURIComponent(location)}`;

//     await page.goto(url, { waitUntil: "networkidle2" });

//     // ✅ Scroll to load more jobs
//     for (let i = 0; i < 3; i++) {
//       await page.evaluate(() => window.scrollBy(0, window.innerHeight));
//       await new Promise((resolve) => setTimeout(resolve, 2000)); // replaced waitForTimeout
//     }

//     await page.waitForSelector(".base-card", { timeout: 10000 });

//     const jobs = await page.evaluate(() => {
//       const jobsArray = [];
//       document.querySelectorAll(".base-card").forEach((job) => {
//         const title = job
//           .querySelector("h3.base-search-card__title")
//           ?.innerText.trim();
//         const link = job.querySelector("a.base-card__full-link")?.href;
//         const company = job
//           .querySelector("h4.base-search-card__subtitle")
//           ?.innerText.trim();
//         const location = job
//           .querySelector("span.job-search-card__location")
//           ?.innerText.trim();
//         const description = job
//           .querySelector(".job-search-card__snippet")
//           ?.innerText.trim();

//         if (title && link) {
//           jobsArray.push({ title, company, location, description, link });
//         }
//       });
//       return jobsArray;
//     });

//     res.json({ success: true, jobs });
//   } catch (error) {
//     console.error("Error fetching LinkedIn jobs:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch jobs" });
//   } finally {
//     await browser.close();
//   }
// };

// module.exports = { fetchLinkedInJobs };


























const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
require("dotenv").config();

puppeteer.use(StealthPlugin());

const fetchLinkedInJobs = async (req, res) => {
  const { keywords, location } = req.body;

  if (!keywords || !location) {
    return res
      .status(400)
      .json({ success: false, message: "Keywords and location are required." });
  }

  const browser = await puppeteer.launch({
    headless: false, // ✅ use false to see login steps; change to true later
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    // ✅ Set realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    );

    // ✅ Go to LinkedIn login page
    await page.goto("https://www.linkedin.com/login", {
      waitUntil: "networkidle2",
    });

    // ✅ Fill email and password
    await page.type("#username", process.env.LINKEDIN_EMAIL, { delay: 100 });
    await page.type("#password", process.env.LINKEDIN_PASSWORD, { delay: 100 });

    // ✅ Click login
    await page.click("button[type=submit]");

    // ✅ Wait for navigation after login
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    console.log("✅ Logged in successfully!");

    // ✅ Now go to jobs page
    const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
      keywords
    )}&location=${encodeURIComponent(location)}`;

    await page.goto(url, { waitUntil: "networkidle2" });

    // ✅ Scroll to load more jobs
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    await page.waitForSelector(".base-card", { timeout: 10000 });

    const jobs = await page.evaluate(() => {
      const jobsArray = [];
      document.querySelectorAll(".base-card").forEach((job) => {
        const title = job
          .querySelector("h3.base-search-card__title")
          ?.innerText.trim();
        const link = job.querySelector("a.base-card__full-link")?.href;
        const company = job
          .querySelector("h4.base-search-card__subtitle")
          ?.innerText.trim();
        const location = job
          .querySelector("span.job-search-card__location")
          ?.innerText.trim();
        const description = job
          .querySelector(".job-search-card__snippet")
          ?.innerText.trim();

        if (title && link) {
          jobsArray.push({ title, company, location, description, link });
        }
      });
      return jobsArray;
    });

    res.json({ success: true, jobs });
  } catch (error) {
    console.error("❌ Error fetching LinkedIn jobs:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch LinkedIn jobs" });
  } finally {
    await browser.close();
  }
};

module.exports = { fetchLinkedInJobs };
