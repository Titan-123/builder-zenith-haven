const puppeteer = require("puppeteer");
const Job = require("../models/jobModel");
const {
  parseExperience,
  parseSalary,
  parseLocation,
  convertRelativeDate,
  parseJobType,
} = require("../utils/jobUtils"); // adjust path

const fetchMonsterJobs = async (req, res) => {
  const { keywords, location } = req.body;
  const pageLimit = 2;
  let jobs = [];

  const locationParam = location ? location.replace(/ /g, ",") : "";

  const browser = await puppeteer.launch({
    headless: false, // Set to true in production
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
  );

  for (let pageNum = 1; pageNum <= pageLimit; pageNum++) {
    const monsterURL = `https://www.monsterindia.com/srp/results?query=${keywords.replace(
      / /g,
      "+"
    )}&locations=${locationParam}&page=${pageNum}`;

    try {
      console.log(`Fetching page ${pageNum}:`, monsterURL);
      await page.goto(monsterURL, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      // Scroll down to ensure lazy-loaded jobs render
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Check if jobs exist
      const jobExists = await page.$(".cardContainer");
      if (!jobExists) {
        console.log(`No jobs found on page ${pageNum}!`);
        continue;
      }

    //   const pageJobs = await page.evaluate(() => {
    //     return Array.from(document.querySelectorAll(".cardContainer")).map(
    //       (job) => {
    //         const title =
    //           job.querySelector(".jobTitle")?.innerText.trim() || null;

    //         const company =
    //           job.querySelector(".companyName p")?.innerText.trim() || null;

    //         const location =
    //           job.querySelector(".details.location")?.innerText.trim() || null;

    //         const experience =
    //           job
    //             .querySelector(".experienceSalary .details")
    //             ?.innerText.trim() || null;

    //         // Salary not available in shared HTML
    //         const salary = null;

    //         // Build job link using job card ID
    //         const jobId = job.getAttribute("id");
    //         const link = jobId
    //           ? `https://www.monsterindia.com/job/${jobId}`
    //           : null;

    //         // Date posted not available in shared HTML
    //         const datePosted = null;

    //         return {
    //           title,
    //           company,
    //           location,
    //           experience,
    //           salary,
    //           link,
    //           datePosted,
    //         };
    //       }
    //     );
    //   });

    const pageJobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".cardContainer")).map(
        (job) => {
          const title =
            job.querySelector(".jobTitle")?.innerText.trim() || null;
          const company =
            job.querySelector(".companyName p")?.innerText.trim() || null;
          const location =
            job.querySelector(".details.location")?.innerText.trim() || null;
          const experience =
            job.querySelector(".experienceSalary .details")?.innerText.trim() ||
            null;
          const salary = null;

          const jobId = job.getAttribute("id");
          const link = jobId
            ? `https://www.monsterindia.com/job/${jobId}`
            : null;

          const datePosted =
            job.querySelector(".timeText")?.innerText.trim() || null;

          return {
            title,
            company,
            location,
            experience,
            salary,
            link,
            datePosted,
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

  // Process jobs data
  jobs = jobs.map((job) => {
    const exp = parseExperience(job.experience);
    const parsedSalary = parseSalary(job.salary);
    const parsedLocation = parseLocation(job.location);
    const jobType=parseJobType(job.location);

    return {
      ...job,
      experience: exp,
      salary: parsedSalary,
      location: parsedLocation,
        jobType,
      portal: "Monster",
      datePostedISO: convertRelativeDate(job.datePosted),
    };
  });

  // Save to DB
//   try {
//     await Job.insertMany(jobs);
//     console.log("Monster jobs saved to DB successfully!");
//   } catch (error) {
//     console.error("Error saving Monster jobs to DB:", error.message);
//   }


try {
  for (const job of jobs) {
    if (!job.link) continue; // skip if link is null

    await Job.updateOne(
      { link: job.link }, // filter by link
      { $set: job }, // update with new data
      { upsert: true } // insert if not exists
    );

    // console.log(`Monster job upserted: ${job.link}`);
  }
  console.log("Monster jobs processing completed.");
} catch (error) {
  console.error("Error saving Monster jobs to DB:", error.message);
}


  res.json({ jobs });
};

module.exports =  fetchMonsterJobs ;
