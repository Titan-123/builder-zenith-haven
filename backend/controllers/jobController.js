// const axios = require("axios");
// const cheerio = require("cheerio");
// const puppeteer = require("puppeteer");
// const puppeteerExtra = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const { chromium } = require("playwright");

// puppeteerExtra.use(StealthPlugin());

// // const fetchIndeedJobs = async (req, res) => {
// //   const { keywords, location } = req.body;
// //   const pageLimit = 2; 
// //   let jobs = [];

// //   for (let page = 0; page < pageLimit; page++) {
// //     const start = page * 10; // Each page has ~10 jobs
// //     const indeedURL = `https://www.indeed.com/jobs?q=${encodeURIComponent(
// //       keywords
// //     )}&l=${encodeURIComponent(location)}&start=${start}`;

// //     // Using ScraperAPI
// //     const scraperURL = `http://api.scraperapi.com?api_key=${
// //       process.env.SCRAPING_API_KEY
// //     }&url=${encodeURIComponent(indeedURL)}`;

// //     try {
// //       console.log(`Fetching page ${page + 1}:`, scraperURL);
// //       const { data } = await axios.get(scraperURL);
// //       const $ = cheerio.load(data);

// //       $(".job_seen_beacon").each((index, element) => {
// //         let title = $(element).find("h2.jobTitle span").text().trim();
// //         let link = "https://www.indeed.com" + $(element).find("a").attr("href");

// //         // ✅ Multiple selectors for better accuracy
// //         let company =
// //           $(element).find(".companyName").text().trim() ||
// //           $(element).find("[data-testid='company-name']").text().trim();

// //         let location =
// //           $(element).find(".companyLocation").text().trim() ||
// //           $(element).find("[data-testid='text-location']").text().trim();

// //         // 🔥 Fetching more details
// //         let salary =
// //           $(element).find(".salary-snippet-container").text().trim() ||
// //           $(element).find("[data-testid='attribute-snippet']").text().trim() ||
// //           "Not specified";

// //         // let jobType =
// //         //   $(element).find(".jobCardReqItem").text().trim() || "Not specified";

// //         // let description =
// //         //   $(element).find(".job-snippet").text().trim() || "No description";

// //         let jobType =
// //           $(element)
// //             .find(".jobCardReqContainer .jobCardReqItem")
// //             .text()
// //             .trim() ||
// //           $(element).find(".attribute_snippet").text().trim() ||
// //           $(element).find("[data-testid='job-type']").text().trim() ||
// //           "Not specified";

// //         // ✅ Improved Job Description Extraction
// //         let description =
// //           $(element)
// //             .find(".job-snippet ul li") // If job description is in <ul><li>
// //             .map((i, el) => $(el).text().trim())
// //             .get()
// //             .join(" ") ||
// //           $(element).find(".job-snippet").text().trim() ||
// //           $(element).find("[data-testid='job-snippet']").text().trim() ||
// //           "No description available";

// //         if (title && link) {
// //           jobs.push({
// //             title,
// //             company,
// //             location,
// //             salary,
// //             jobType,
// //             description,
// //             link,
// //           });
// //         }
// //       });

// //       console.log(`Page ${page + 1} fetched, total jobs:`, jobs.length);
// //     } catch (error) {
// //       console.error(`Error fetching page ${page + 1}:`, error.message);
// //     }
// //   }

// //   res.json({ jobs });
// // };


// async function fetchIndeedJobs(keywords, location, pages = 2) {
//   console.log("Fetching Indeed jobs...");
//   const browser = await puppeteer.launch({ headless: false }); // set to true for headless mode
//   const page = await browser.newPage();

//   let jobs = [];

//   for (let pageNumber = 0; pageNumber < pages; pageNumber++) {
//     const start = pageNumber * 10;
//     const url = `https://www.indeed.com/jobs?q=${encodeURIComponent(
//       keywords
//     )}&l=${encodeURIComponent(location)}&start=${start}`;

//     console.log(`Fetching page ${pageNumber + 1}: ${url}`);
//     await page.goto(url, { waitUntil: "networkidle2" });

//     // Wait for job cards to load
//     await page
//       .waitForSelector(".job_seen_beacon", { timeout: 10000 })
//       .catch(() => {
//         console.log("Jobs not found or captcha triggered.");
//       });

//     const jobsOnPage = await page.evaluate(() => {
//       const jobCards = document.querySelectorAll(".job_seen_beacon");
//       const data = [];
//       jobCards.forEach((card) => {
//         const title = card.querySelector("h2.jobTitle span")?.innerText || "";
//         const company = card.querySelector(".companyName")?.innerText || "";
//         const location =
//           card.querySelector(".companyLocation")?.innerText || "";
//         const salary =
//           card.querySelector(".salary-snippet-container")?.innerText ||
//           "Not specified";
//         const jobType =
//           card.querySelector(".jobCardReqContainer .jobCardReqItem")
//             ?.innerText || "Not specified";
//         const description =
//           Array.from(card.querySelectorAll(".job-snippet ul li"))
//             .map((li) => li.innerText.trim())
//             .join(" ") ||
//           card.querySelector(".job-snippet")?.innerText ||
//           "No description";
//         const link =
//           "https://www.indeed.com" +
//           (card.querySelector("a")?.getAttribute("href") || "");

//         if (title && link) {
//           data.push({
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
//       return data;
//     });

//     console.log(
//       `Page ${pageNumber + 1} fetched, jobs found: ${jobsOnPage.length}`
//     );
//     jobs = jobs.concat(jobsOnPage);

//     // ✅ Random delay to mimic human browsing
//     await new Promise(
//       (r) => setTimeout(r, Math.random() * 5000 + 2000) // wait 2-7 sec
//     );
//   }

//   await browser.close();

//   return jobs;
// }


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
//       return jobsArray;
//     });

//     jobs.push(...jobListings);
//   } catch (error) {
//     console.error("Error fetching LinkedIn jobs:", error);
//   } finally {
//     await browser.close();
//   }

//   res.json({ jobs });
// };


// // const fetchLinkedInJobs = async (req, res) => {
// //   const { keywords, location } = req.body;
// //   const jobs = [];
// //   const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
// //     keywords
// //   )}&location=${encodeURIComponent(location)}`;

// //   const browser = await puppeteer.launch({ headless: true });
// //   const page = await browser.newPage();

// //   try {
// //     await page.goto(url, { waitUntil: "networkidle2" });
// //     await page.waitForSelector(".base-card");

// //     const jobListings = await page.evaluate(() => {
// //       const jobsArray = [];
// //       document.querySelectorAll(".base-card").forEach((job) => {
// //         const title = job
// //           .querySelector("h3.base-search-card__title")
// //           ?.innerText.trim();
// //         const link = job.querySelector("a.base-card__full-link")?.href;
// //         const company = job
// //           .querySelector("h4.base-search-card__subtitle")
// //           ?.innerText.trim();
// //         const location = job
// //           .querySelector("span.job-search-card__location")
// //           ?.innerText.trim();
// //         const description = job
// //           .querySelector(".job-search-card__snippet")
// //           ?.innerText.trim();

// //         if (title && link) {
// //           jobsArray.push({
// //             title,
// //             company,
// //             location,
// //             description,
// //             link,
// //           });
// //         }
// //       });
// //       return jobsArray;
// //     });

//     // Normalize and prepare for DB
// //     const normalizedJobs = jobListings.map((job) => ({
// //       title: job.title || "",
// //       company: job.company || "",
// //       location: job.location || "",
// //       description: job.description || "",
// //       link: job.link,
// //       platform: "LinkedIn", // Platform identifier
// //       keyword: keywords,
// //       jobLocation: location,
// //       scrapedAt: new Date(), // Timestamp
// //     }));

// //     // OPTIONAL: Save to DB here if using Mongoose or similar
// //     // await Job.insertMany(normalizedJobs);

// //     res.json({ success: true, jobs: normalizedJobs });
// //   } catch (error) {
// //     console.error("Error fetching LinkedIn jobs:", error);
// //     res
// //       .status(500)
// //       .json({ success: false, message: "Failed to fetch LinkedIn jobs" });
// //   } finally {
// //     await browser.close();
// //   }
// // };


// // const puppeteer = require("puppeteer-extra");
// // const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// // puppeteer.use(StealthPlugin());

// // const fetchLinkedInJobs = async (req, res) => {
// //   const { keywords, location } = req.body;
// //   const jobs = [];
// //   const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
// //     keywords
// //   )}&location=${encodeURIComponent(location)}`;

// //   const browser = await puppeteer.launch({
// //     headless: false, // change to true in production
// //     args: ["--no-sandbox", "--disable-setuid-sandbox"],
// //   });

// //   const page = await browser.newPage();

// //   try {
// //     // Set realistic user agent
// //     await page.setUserAgent(
// //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
// //     );

// //     // OPTIONAL: Login to LinkedIn if needed
// //     /*
// //     await page.goto("https://www.linkedin.com/login");
// //     await page.type("#username", process.env.LINKEDIN_USERNAME);
// //     await page.type("#password", process.env.LINKEDIN_PASSWORD);
// //     await page.click("[type=submit]");
// //     await page.waitForNavigation({ waitUntil: "networkidle2" });
// //     */

// //     // Navigate to jobs page
// //     await page.goto(url, { waitUntil: "networkidle2" });

// //     // Wait for job cards
// //     await page.waitForSelector(".base-card", { timeout: 10000 });

// //     // Evaluate page content
// //     const jobListings = await page.evaluate(() => {
// //       const jobsArray = [];
// //       document.querySelectorAll(".base-card").forEach((job) => {
// //         const title = job
// //           .querySelector("h3.base-search-card__title")
// //           ?.innerText.trim();
// //         const link = job.querySelector("a.base-card__full-link")?.href;
// //         const company = job
// //           .querySelector("h4.base-search-card__subtitle")
// //           ?.innerText.trim();
// //         const location = job
// //           .querySelector("span.job-search-card__location")
// //           ?.innerText.trim();
// //         const description = job
// //           .querySelector(".job-search-card__snippet")
// //           ?.innerText.trim();

// //         if (title && link) {
// //           jobsArray.push({
// //             title,
// //             company,
// //             location,
// //             description,
// //             link,
// //           });
// //         }
// //       });
// //       return jobsArray;
// //     });

// //     // Normalize
// //     const normalizedJobs = jobListings.map((job) => ({
// //       title: job.title || "",
// //       company: job.company || "",
// //       location: job.location || "",
// //       description: job.description || "",
// //       link: job.link,
// //       platform: "LinkedIn",
// //       keyword: keywords,
// //       jobLocation: location,
// //       scrapedAt: new Date(),
// //     }));

// //     res.json({ success: true, jobs: normalizedJobs });
// //   } catch (error) {
// //     console.error("Error fetching LinkedIn jobs:", error);
// //     res
// //       .status(500)
// //       .json({ success: false, message: "Failed to fetch LinkedIn jobs" });
// //   } finally {
// //     await browser.close();
// //   }
// // };






// // const fetchNaukriJobs = async (req, res) => {
// //   const { keywords, location } = req.body;
// //   const pageLimit = 2;
// //   let jobs = [];

// //   // const browser = await puppeteerExtra.launch({
// //   //   headless: false,
// //   //   args: ["--no-sandbox"],
// //   // });
// //   const browser = await puppeteerExtra.launch({
// //     headless: true,
// //     args: ["--no-sandbox", "--disable-setuid-sandbox"],
// //   });

// //   const page = await browser.newPage();

// //   await page.setUserAgent(
// //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
// //   );

// //   for (let pageNum = 1; pageNum <= pageLimit; pageNum++) {
// //     const naukriURL = `https://www.naukri.com/${keywords.replace(
// //       / /g,
// //       "-"
// //     )}-jobs-in-${location.replace(/ /g, "-")}-${pageNum}`;

// //     try {
// //       console.log(`Fetching page ${pageNum}:`, naukriURL);
// //       await page.goto(naukriURL, { waitUntil: "domcontentloaded" });

// //       // Scroll multiple times to load dynamic content
// //       for (let i = 0; i < 3; i++) {
// //         await page.evaluate(() => {
// //           window.scrollBy(0, window.innerHeight);
// //         });
// //         await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3 sec each scroll
// //       }

// //       // Final longer wait to ensure complete load
// //       await new Promise((resolve) => setTimeout(resolve, 5000)); // wait extra 5 sec

// //       // Check if jobs exist
// //       const jobExists = await page.$(".cust-job-tuple");
// //       if (!jobExists) {
// //         console.log(`No jobs found on page ${pageNum}!`);
// //         continue;
// //       } else {
// //         console.log(`Jobs found on page ${pageNum}! Extracting data...`);
// //       }

// //       // Extract job data
// //       const pageJobs = await page.evaluate(() => {
// //         return Array.from(document.querySelectorAll(".cust-job-tuple")).map(
// //           (job) => {
// //             const title =
// //               job.querySelector("a.title")?.innerText.trim() || "No Title";
// //            const company =
// //              job.querySelector("a.comp-name")?.innerText.trim() ||
// //              job.querySelector(".subTitle span")?.innerText.trim() ||
// //              job.querySelector(".subTitle")?.innerText.trim() ||
// //              "No Company";

// //             const location =
// //               job.querySelector(".locWdth")?.innerText.trim() || "No Location";
// //             const experience =
// //               job.querySelector(".expwdth")?.innerText.trim() ||
// //               "Not specified";
// //            const salary =
// //              job.querySelector(".sal-wrap span[title]")?.innerText.trim() ||
// //              job.querySelector(".salary span")?.innerText.trim() ||
// //              job.querySelector(".salary")?.innerText.trim() ||
// //              "Not specified";

// //             //  const description =
// //             //    job.querySelector(".job-desc")?.innerText.trim() ||
// //             //    "No Description";

// //                   const datePosted =
// //                     job.querySelector(".job-post-day")?.innerText.trim() ||
// //                     "No Date Posted";

// //             const link = job.querySelector("a.title")?.href || "No Link";

// //             return { title, company, location, experience,salary,datePosted, link };
// //           }
// //         );
// //       });

// //       jobs.push(...pageJobs);
// //       console.log(`Page ${pageNum} fetched, total jobs so far: ${jobs.length}`);
// //     } catch (error) {
// //       console.error(`Error fetching page ${pageNum}:`, error.message);
// //     }
// //   }

// //   await browser.close();
// //   res.json({ jobs });
// // };




// const fetchNaukriJobs = async (req, res) => {
//   const { keywords, location } = req.body;
//   const pageLimit = 2;
//   let jobs = [];

//   const browser = await puppeteerExtra.launch({
//     headless: true,
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });

//   const page = await browser.newPage();

//   await page.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
//   );

//   for (let pageNum = 1; pageNum <= pageLimit; pageNum++) {
//     const naukriURL = `https://www.naukri.com/${keywords.replace(
//       / /g,
//       "-"
//     )}-jobs-in-${location.replace(/ /g, "-")}-${pageNum}`;

//     try {
//       console.log(`Fetching page ${pageNum}:`, naukriURL);
//       await page.goto(naukriURL, { waitUntil: "domcontentloaded" });

//       // Scroll multiple times to load dynamic content
//       for (let i = 0; i < 3; i++) {
//         await page.evaluate(() => {
//           window.scrollBy(0, window.innerHeight);
//         });
//         await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3 sec each scroll
//       }

//       // Final longer wait to ensure complete load
//       await new Promise((resolve) => setTimeout(resolve, 5000)); // wait extra 5 sec

//       // Check if jobs exist
//       const jobExists = await page.$(".cust-job-tuple");
//       if (!jobExists) {
//         console.log(`No jobs found on page ${pageNum}!`);
//         continue;
//       } else {
//         console.log(`Jobs found on page ${pageNum}! Extracting data...`);
//       }

//       // Extract job data
//       // const pageJobs = await page.evaluate(() => {
//       //   return Array.from(document.querySelectorAll(".cust-job-tuple")).map(
//       //     (job) => {
//       //       const title =
//       //         job.querySelector("a.title")?.innerText.trim() || "No Title";
//       //       const company =
//       //         job.querySelector("a.comp-name")?.innerText.trim() ||
//       //         job.querySelector(".subTitle span")?.innerText.trim() ||
//       //         job.querySelector(".subTitle")?.innerText.trim() ||
//       //         "No Company";

//       //       const location =
//       //         job.querySelector(".locWdth")?.innerText.trim() || "No Location";
//       //       const experience =
//       //         job.querySelector(".expwdth")?.innerText.trim() ||
//       //         "Not specified";
//       //       const salary =
//       //         job.querySelector(".sal-wrap span[title]")?.innerText.trim() ||
//       //         job.querySelector(".salary span")?.innerText.trim() ||
//       //         job.querySelector(".salary")?.innerText.trim() ||
//       //         "Not specified";

//       //       const datePosted =
//       //         job.querySelector(".job-post-day")?.innerText.trim() ||
//       //         "No Date Posted";

//       //       const link = job.querySelector("a.title")?.href || "No Link";

//       //       return {
//       //         title,
//       //         company,
//       //         location,
//       //         experience,
//       //         salary,
//       //         datePosted,
//       //         link,
//       //       };
//       //     }
//       //   );
//       // });

//       // jobs.push(...pageJobs);
//       // console.log(`Page ${pageNum} fetched, total jobs so far: ${jobs.length}`);


//       const pageJobs = await page.evaluate(() => {
//         return Array.from(document.querySelectorAll(".cust-job-tuple")).map(
//           (job) => {
//             const getTextOrNull = (selector) => {
//               const el = job.querySelector(selector);
//               const text = el?.innerText.trim();
//               return text && text !== "" ? text : null;
//             };

//             const title = getTextOrNull("a.title") || "No Title"; // keep title as string
//             const company =
//               getTextOrNull("a.comp-name") ||
//               getTextOrNull(".subTitle span") ||
//               getTextOrNull(".subTitle") ||
//               null;

//             const location = getTextOrNull(".locWdth") || null;
//             const experience = getTextOrNull(".expwdth") || null;

//             const salary =
//               getTextOrNull(".sal-wrap span[title]") ||
//               getTextOrNull(".salary span") ||
//               getTextOrNull(".salary") ||
//               null;

//             const datePosted = getTextOrNull(".job-post-day") || null;

//             const link = job.querySelector("a.title")?.href || null;

//             return {
//               title,
//               company,
//               location,
//               experience,
//               salary,
//               datePosted,
//               link,
//             };
//           }
//         );
//       });

//       jobs.push(...pageJobs);
//       console.log(`Page ${pageNum} fetched, total jobs so far: ${jobs.length}`);

//     } catch (error) {
//       console.error(`Error fetching page ${pageNum}:`, error.message);
//     }
//   }

//   await browser.close();


//   jobs = jobs.map((job) => {
//     const exp = parseExperience(job.experience);
//     const jobType = job.location?.toLowerCase().includes("hybrid")
//       ? "Hybrid"
//       : job.location?.toLowerCase().includes("remote")
//       ? "Remote"
//       : "Onsite";

//     return {
//       ...job,
//       datePostedISO: convertRelativeDate(job.datePosted),
//       minExperience: exp.minExperience,
//       maxExperience: exp.maxExperience,
//       portal: "Naukri", // Add portal identifier
//       jobType
//     };
//   });


//   res.json({ jobs });
// };

// // Utility function to convert "x days/weeks ago" to ISO date
// function convertRelativeDate(relativeDateStr) {
//   const now = new Date();

//   if (!relativeDateStr || typeof relativeDateStr !== "string") {
//     return now.toISOString();
//   }

//   relativeDateStr = relativeDateStr.toLowerCase();

//   if (
//     relativeDateStr.includes("today") ||
//     relativeDateStr.includes("just now")
//   ) {
//     return now.toISOString();
//   }

//   if (relativeDateStr.includes("yesterday")) {
//     const yesterday = new Date();
//     yesterday.setDate(now.getDate() - 1);
//     return yesterday.toISOString();
//   }

//   // const match = relativeDateStr.match(
//   //   /(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago/
//   // );

//   const match = relativeDateStr.match(
//     /(\d+)\+?\s+(minute|hour|day|week|month|year)s?\s+ago/
//   );

//   if (match) {
//     const value = parseInt(match[1]);
//     const unit = match[2];

//     const date = new Date(now);

//     switch (unit) {
//       case "minute":
//         date.setMinutes(now.getMinutes() - value);
//         break;
//       case "hour":
//         date.setHours(now.getHours() - value);
//         break;
//       case "day":
//         date.setDate(now.getDate() - value);
//         break;
//       case "week":
//         date.setDate(now.getDate() - value * 7);
//         break;
//       case "month":
//         date.setMonth(now.getMonth() - value);
//         break;
//       case "year":
//         date.setFullYear(now.getFullYear() - value);
//         break;
//     }

//     return date.toISOString();
//   }

//   // If no pattern matches, return current date
//   return now.toISOString();
// }

// function parseExperience(expStr) {
//   if (
//     !expStr ||
//     typeof expStr !== "string" ||
//     expStr.toLowerCase() === "not specified"
//   ) {
//     return { minExperience: null, maxExperience: null };
//   }

//   const match = expStr.match(/(\d+)\s*-\s*(\d+)/); // matches '4-8' or '10 - 20'
//   if (match) {
//     return {
//       minExperience: parseInt(match[1]),
//       maxExperience: parseInt(match[2]),
//     };
//   }

//   const singleMatch = expStr.match(/(\d+)/);
//   if (singleMatch) {
//     const value = parseInt(singleMatch[1]);
//     return {
//       minExperience: value,
//       maxExperience: value,
//     };
//   }

//   return { minExperience: null, maxExperience: null };
// }



// // =====================================================================================================================================================================================


// // const fetchMonsterJobs = async (req, res) => {
// //   const { keywords, location } = req.body;
// //   const pageLimit = 2;
// //   let jobs = [];

// //   const browser = await puppeteer.launch({
// //     headless: false, // Set to true in production
// //     args: ["--no-sandbox"],
// //   });

// //   const page = await browser.newPage();

// //   await page.setUserAgent(
// //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
// //   );

// //   for (let pageNum = 1; pageNum <= pageLimit; pageNum++) {
// //     const monsterURL = `https://www.monsterindia.com/srp/results?query=${keywords.replace(
// //       / /g,
// //       "+"
// //     )}&locations=${location.replace(/ /g, ",")}&page=${pageNum}`;

// //     try {
// //       console.log(`Fetching page ${pageNum}:`, monsterURL);
// //       await page.goto(monsterURL, {
// //         waitUntil: "networkidle2",
// //         timeout: 60000,
// //       });

// //       // Scroll down if needed
// //       await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
// //       await new Promise((resolve) => setTimeout(resolve, 5000));

// //       // Check if jobs exist
// //       const jobExists = await page.$(".srpResultCardContainer");
// //       if (!jobExists) {
// //         console.log(`No jobs found on page ${pageNum}!`);
// //         continue;
// //       }

// //       const pageJobs = await page.evaluate(() => {
// //         return Array.from(
// //           document.querySelectorAll(".srpResultCardContainer")
// //         ).map((job) => {
// //           const title =
// //             job.querySelector(".jobTitle")?.innerText.trim() || "No Title";
// //           const company =
// //             job.querySelector(".companyName")?.innerText.trim() || "No Company";
// //           const location =
// //             job.querySelector(".details .location")?.innerText.trim() ||
// //             "No Location";
// //           const experience =
// //             job.querySelector(".experience")?.innerText.trim() ||
// //             "Not specified";
// //           const salary =
// //             job.querySelector(".package")?.innerText.trim() || "Not specified";
// //           const link = job.querySelector(".jobTitle a")?.href || "No Link";

// //           return { title, company, location, experience, salary, link };
// //         });
// //       });

// //       jobs.push(...pageJobs);
// //       console.log(`Page ${pageNum} fetched, total jobs: ${jobs.length}`);
// //     } catch (error) {
// //       console.error(`Error fetching page ${pageNum}:`, error.message);
// //     }
// //   }

// //   await browser.close();
// //   res.json({ jobs });
// // };


// const fetchMonsterJobs = async (req, res) => {
//   const { keywords, location } = req.body;
//   const pageLimit = 2;
//   let jobs = [];

//   const browser = await puppeteer.launch({
//     headless: false, // Set to true in production
//     args: ["--no-sandbox"],
//   });

//   const page = await browser.newPage();

//   await page.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
//   );

//   for (let pageNum = 1; pageNum <= pageLimit; pageNum++) {
//     const monsterURL = `https://www.monsterindia.com/srp/results?query=${keywords.replace(
//       / /g,
//       "+"
//     )}&locations=${location.replace(/ /g, ",")}&page=${pageNum}`;

//     try {
//       console.log(`Fetching page ${pageNum}:`, monsterURL);
//       await page.goto(monsterURL, {
//         waitUntil: "networkidle2",
//         timeout: 60000,
//       });

//       // Scroll down to ensure lazy-loaded jobs render
//       await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
//       await new Promise((resolve) => setTimeout(resolve, 5000));

//       // Check if jobs exist
//       const jobExists = await page.$(".cardContainer");
//       if (!jobExists) {
//         console.log(`No jobs found on page ${pageNum}!`);
//         continue;
//       }

//       const pageJobs = await page.evaluate(() => {
//         return Array.from(document.querySelectorAll(".cardContainer")).map(
//           (job) => {
//             const title =
//               job.querySelector(".jobTitle")?.innerText.trim() || "No Title";

//             const company =
//               job.querySelector(".companyName p")?.innerText.trim() ||
//               "No Company";

//             const location =
//               job.querySelector(".details.location")?.innerText.trim() ||
//               job.querySelector(".details.location").textContent.trim() ||
//               "No Location";

//             const experience =
//               job
//                 .querySelector(".experienceSalary .details")
//                 ?.innerText.trim() || "Not specified";

//             // Salary not available in shared HTML
//             const salary = "Not specified";

//             // Build job link using job card ID
//             const jobId = job.getAttribute("id");
//             const link = jobId
//               ? `https://www.monsterindia.com/job/${jobId}`
//               : "No Link";

//             return { title, company, location, experience, salary, link };
//           }
//         );
//       });

//       jobs.push(...pageJobs);
//       console.log(`Page ${pageNum} fetched, total jobs: ${jobs.length}`);
//     } catch (error) {
//       console.error(`Error fetching page ${pageNum}:`, error.message);
//     }
//   }

//   await browser.close();
//   res.json({ jobs });
// };









// // const fetchWellfoundJobs = async (req, res) => {
// //   const { keywords, location } = req.body;
// //   const pageLimit = 2;
// //   let jobs = [];

// //   console.log('functioncalled')

// //   // Launch browser with saved session
// //   const browser = await chromium.launch({ headless: true });
// //   const context = await browser.newContext();
// //   const page = await context.newPage();

// //   try {
// //     for (let i = 1; i <= pageLimit; i++) {
// //       await page.goto(
// //         `https://wellfound.com/jobs?query=${keywords}&location=${location}&page=${i}`,
// //         {
// //           waitUntil: "domcontentloaded",
// //         }
// //       );

// //       // Extract job data
// //       const jobListings = await page.$$(".job-listing-selector"); // Replace with actual selector
// //       console.log(jobListings)
// //       for (const job of jobListings) {
// //         const title = await job.$eval(
// //           ".job-title-selector",
// //           (el) => el.innerText
// //         );
// //         const company = await job.$eval(
// //           ".company-name-selector",
// //           (el) => el.innerText
// //         );
// //         const link = await job.$eval(".job-link-selector", (el) => el.href);

// //         jobs.push({ title, company, link });
// //       }
// //     }

// //     res.json({ success: true, jobs });
// //   } catch (error) {
// //     console.error("Error fetching Wellfound jobs:", error);
// //     res.status(500).json({ success: false, message: "Failed to fetch jobs" });
// //   } finally {
// //     await browser.close();
// //   }
// // };






// const fetchWellfoundJobs = async (req, res) => {
//   const { keywords, location } = req.body;
//   const pageLimit = 2;
//   let jobs = [];

//   console.log("Function called");

//   const browser = await chromium.launch({ headless: true });
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   try {
//     for (let i = 1; i <= pageLimit; i++) {
//       const wellfoundURL = `https://wellfound.com/jobs?query=${encodeURIComponent(
//         keywords
//       )}&location=${encodeURIComponent(location)}&page=${i}`;
//       console.log("Fetching page:", wellfoundURL);

//       await page.goto(wellfoundURL, { waitUntil: "domcontentloaded" });

//       // Wait extra for dynamic content load
//       await page.waitForTimeout(5000);

//       const jobCards = await page.$$("a[href*='/jobs/']");
//       console.log("Job cards found:", jobCards.length);

//       for (const job of jobCards) {
//         const title = await job
//           .$eval("div > div:nth-child(1)", (el) => el.innerText)
//           .catch(() => "No Title");

//         const company = await job
//           .$eval("div > div:nth-child(2)", (el) => el.innerText)
//           .catch(() => "No Company");

//         const linkSuffix = await job.getAttribute("href");
//         const link = linkSuffix
//           ? `https://wellfound.com${linkSuffix}`
//           : "No Link";

//         jobs.push({ title, company, link });
//       }
//     }

//     res.json({ success: true, jobs });
//   } catch (error) {
//     console.error("Error fetching Wellfound jobs:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch jobs" });
//   } finally {
//     await browser.close();
//   }
// };






// module.exports = {
//   fetchIndeedJobs,
//   fetchLinkedInJobs,
//   fetchNaukriJobs,
//   fetchMonsterJobs,
//   fetchWellfoundJobs,
// };

















































const Job = require("../models/jobModel");

const searchJobs = async (req, res) => {
  console.log("backend called")
  try {
    const {
      role,
      location,
      experience,
      salaryRange,
      portal,
      search,
      locationSearch,
      page = 1,
      limit = 20,
      sortBy = "datePostedISO",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    // General search on title or company
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Role filter (job title)
    if (role) {
      query.title = { $regex: role, $options: "i" };
    }

    // Location filter
    if (location) {
      query["location.locations"] = { $regex: location, $options: "i" };
    }

    // Additional location search
    if (locationSearch) {
      query["location.locations"] = { $regex: locationSearch, $options: "i" };
    }

    // Portal filter
    if (portal) {
      query.portal = portal;
    }

    // Experience filter (assuming "2-5" format)
    if (experience) {
      const [minExp, maxExp] = experience.split("-").map(Number);
      query["experience.min"] = {};
      if (!isNaN(minExp)) query["experience.min"].$gte = minExp;
      if (!isNaN(maxExp)) query["experience.min"].$lte = maxExp;
    }

    // Salary range filter (assuming "500000-1000000" format)
    if (salaryRange) {
      const [minSalary, maxSalary] = salaryRange.split("-").map(Number);
      query["salary.min"] = {};
      if (!isNaN(minSalary)) query["salary.min"].$gte = minSalary;
      if (!isNaN(maxSalary)) query["salary.min"].$lte = maxSalary;
    }

    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      jobs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error searching jobs:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};




module.exports = { searchJobs };
