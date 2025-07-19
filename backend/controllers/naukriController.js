const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const puppeteerExtra = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { chromium } = require("playwright");
const Job = require("../models/jobModel");
const {
  parseExperience,
  parseSalary,
  convertRelativeDate,
  parseLocation,
  parseJobType,
} = require("../utils/jobUtils");



puppeteerExtra.use(StealthPlugin());

const fetchNaukriJobs = async (req, res) => {
  const { keywords, location } = req.body;
  const pageLimit = 2;
  let jobs = [];

  const browser = await puppeteerExtra.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  for (let pageNum = 1; pageNum <= pageLimit; pageNum++) {
    const naukriURL = `https://www.naukri.com/${keywords.replace(
      / /g,
      "-"
    )}-jobs-in-${location.replace(/ /g, "-")}-${pageNum}`;

    try {
      console.log(`Fetching page ${pageNum}:`, naukriURL);
      await page.goto(naukriURL, { waitUntil: "domcontentloaded" });

      // Scroll multiple times to load dynamic content
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });
        await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3 sec each scroll
      }

      // Final longer wait to ensure complete load
      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait extra 5 sec

      // Check if jobs exist
      const jobExists = await page.$(".cust-job-tuple");
      if (!jobExists) {
        console.log(`No jobs found on page ${pageNum}!`);
        continue;
      } else {
        console.log(`Jobs found on page ${pageNum}! Extracting data...`);
      }

      const pageJobs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".cust-job-tuple")).map(
          (job) => {
            const getTextOrNull = (selector) => {
              const el = job.querySelector(selector);
              const text = el?.innerText.trim();
              return text && text !== "" ? text : null;
            };

            const title = getTextOrNull("a.title") || "No Title"; 
            const company =
              getTextOrNull("a.comp-name") ||
              getTextOrNull(".subTitle span") ||
              getTextOrNull(".subTitle") ||
              null;

            const location = getTextOrNull(".locWdth") || null;
            const experience = getTextOrNull(".expwdth") || null;

            const salary =
              getTextOrNull(".sal-wrap span[title]") ||
              getTextOrNull(".salary span") ||
              getTextOrNull(".salary") ||
              null;

            const datePosted = getTextOrNull(".job-post-day") || null;

            const link = job.querySelector("a.title")?.href || null;

            return {
              title,
              company,
              location,
              experience,
              salary,
              datePosted,
              link,
            };
          }
        );
      });

      jobs.push(...pageJobs);
      console.log(`Page ${pageNum} fetched, total jobs so far: ${jobs.length}`);

    } catch (error) {
      console.error(`Error fetching page ${pageNum}:`, error.message);
    }
  }

  await browser.close();


jobs = jobs.map((job) => {
  const exp = parseExperience(job.experience);
  const parsedSalary = parseSalary(job.salary);
  const parsedLocation = parseLocation(job.location);
    const jobType = parseJobType(job.location);


  return {
    ...job,
    salary: parsedSalary,
    datePostedISO: convertRelativeDate(job.datePosted),
    experience: exp,
    location: parsedLocation,
    portal: "Naukri",
    jobType
  };
});



//   try {
//     await Job.insertMany(jobs);
//     console.log("Jobs saved to DB successfully!");
//   } catch (error) {
//     console.error("Error saving jobs to DB:", error.message);
//   }

for (const job of jobs) {
  try {
    await Job.updateOne(
      { link: job.link }, // filter by link to avoid duplicates
      { $set: job }, // update with new data
      { upsert: true } // insert if not exists
    );
  } catch (error) {
    console.error(`Error upserting job with link ${job.link}:`, error.message);
  }
}





  res.json({ jobs });
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
//     return { min: null, max: null, raw: null };
//   }

//   const match = expStr.match(/(\d+)\s*-\s*(\d+)/); // matches '4-8' or '10 - 20'
//   if (match) {
//     return {
//       min: parseInt(match[1]),
//       max: parseInt(match[2]),
//       raw: expStr,
//     };
//   }

//   const singleMatch = expStr.match(/(\d+)/);
//   if (singleMatch) {
//     const value = parseInt(singleMatch[1]);
//     return {
//       min: value,
//       max: value,
//       raw: expStr,
//     };
//   }

//   return { min: null, max: null, raw: expStr };
// }



// function parseSalary(salaryString) {
//   if (!salaryString) {
//     return { min: null, max: null, raw: null };
//   }

//   const regex = /(\d+)[-\s]*(\d+)?/; // basic pattern like 15-30
//   const match = salaryString.replace(/,/g, "").match(regex);

//   if (match) {
//     const min = parseInt(match[1]);
//     const max = match[2] ? parseInt(match[2]) : min;
//     return { min, max, raw: salaryString };
//   }

//   return { min: null, max: null, raw: salaryString };
  
// }

// function standardizeCityName(cityName) {
//   if (!cityName || typeof cityName !== "string") return cityName;

//   const lower = cityName.toLowerCase().trim();

//   const cityMap = {
//     bangalore: "Bengaluru",
//     gurgaon: "Gurugram",
//     bombay: "Mumbai",
//   };

//   return cityMap[lower] || cityName;
// }


// function parseLocation(locationStr) {
//   if (!locationStr || typeof locationStr !== "string") {
//     return {
//       raw: null,
//       locations: [],
//     };
//   }

//   const cleaned = locationStr
//     .replace(/Hybrid\s*-\s*/i, "")
//     .replace(/Remote\s*-\s*/i, "");

//   const locationsArray = cleaned
//     .split(",")
//     .map((l) => standardizeCityName(l.trim()))
//     .filter((l) => l !== "");

//   return {
//     raw: locationStr,
//     locations: locationsArray,
//   };
// }



// function parseJobType(locationStr) {
//   if (!locationStr || typeof locationStr !== "string") {
//     return "Onsite";
//   }

//   const lowerLoc = locationStr.toLowerCase();

//   if (lowerLoc.includes("hybrid")) {
//     return "Hybrid";
//   } else if (lowerLoc.includes("remote")) {
//     return "Remote";
//   } else {
//     return "Onsite";
//   }
// }

}




module.exports = fetchNaukriJobs

