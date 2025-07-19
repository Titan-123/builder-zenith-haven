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

// Middleware to wrap responses in ApiResponse format
const wrapResponse = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    // If data is already in ApiResponse format, return as is
    if (data && typeof data === "object" && "success" in data) {
      return originalJson.call(this, data);
    }

    // If it's an error response
    if (res.statusCode >= 400) {
      return originalJson.call(this, {
        success: false,
        message: data.message || data.error || "An error occurred",
      });
    }

    // Wrap successful responses
    return originalJson.call(this, {
      success: true,
      data: data,
    });
  };
  next();
};

app.use(wrapResponse);

// Import and use job routes from backend
try {
  const jobRoutes = require("../../backend/routes/jobRoutes");
  app.use("/api/jobs", jobRoutes);
} catch (error) {
  console.warn("Backend routes not found, using mock data");

  // Fallback mock endpoint for jobs search
  app.get("/api/jobs/search", (req, res) => {
    res.json({
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
    });
  });
}

// Health check endpoint
app.get("/api/ping", (req, res) => {
  res.json({ message: "Netlify function is working!" });
});

export const handler = serverless(app);
