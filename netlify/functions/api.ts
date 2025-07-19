const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");

const app = express();

// Configure CORS for frontend
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Import and use job routes from backend
try {
  const jobRoutes = require("../../backend/routes/jobRoutes");
  app.use("/api/jobs", jobRoutes);
} catch (error) {
  console.warn("Backend routes not found, using mock data");

  // Fallback mock endpoint for jobs search
  app.get("/api/jobs/search", (req, res) => {
    res.json({
      success: true,
      data: {
        jobs: [
          {
            id: "1",
            title: "Frontend Developer",
            company: "TechCorp",
            location: "San Francisco, CA",
            salary: "$80,000 - $120,000",
            experience: "2-5 years",
            type: "Full-time",
            description: "We are looking for a skilled Frontend Developer...",
            requirements: ["React", "TypeScript", "CSS"],
            benefits: ["Health Insurance", "Remote Work"],
            portal: "Company Website",
            postedDate: "2024-01-15",
            applicationDeadline: "2024-02-15",
            isRemote: false,
            applicationUrl: "https://example.com/apply",
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });
}

// Health check endpoint
app.get("/api/ping", (req, res) => {
  res.json({ message: "Netlify function is working!" });
});

export const handler = serverless(app);
