import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

// Auth routes
import {
  handleRegister,
  handleLogin,
  handleGoogleLogin,
  handleGetCurrentUser,
  handleChangePassword,
  handleLogout,
} from "./routes/auth";

// Jobs routes
import {
  handleSearchJobs,
  handleGetJobById,
  handleGetFeaturedJobs,
  handleGetRecommendedJobs,
  handleGetJobPortals,
  handleGetJobStats,
} from "./routes/jobs";

// Applications routes
import {
  handleGetApplications,
  handleGetApplicationById,
  handleCreateApplication,
  handleUpdateApplication,
  handleDeleteApplication,
  handleCheckJobSaved,
  handleGetApplicationStats,
} from "./routes/applications";

// Profile routes
import {
  handleGetProfile,
  handleUpdateProfile,
  handleUploadAvatar,
  handleGetProfileStats,
  handleDeleteAccount,
  handleExportData,
} from "./routes/profile";

export function createServer() {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:4173",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // ============================================================================
  // AUTH ROUTES
  // ============================================================================
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/google", handleGoogleLogin);
  app.get("/api/auth/me", handleGetCurrentUser);
  app.post("/api/auth/change-password", handleChangePassword);
  app.post("/api/auth/logout", handleLogout);

  // ============================================================================
  // JOBS ROUTES
  // ============================================================================
  app.get("/api/jobs/search", handleSearchJobs);
  app.get("/api/jobs/featured", handleGetFeaturedJobs);
  app.get("/api/jobs/recommended", handleGetRecommendedJobs);
  app.get("/api/jobs/portals", handleGetJobPortals);
  app.get("/api/jobs/stats", handleGetJobStats);
  app.get("/api/jobs/:id", handleGetJobById);

  // ============================================================================
  // APPLICATIONS ROUTES
  // ============================================================================
  app.get("/api/applications", handleGetApplications);
  app.post("/api/applications", handleCreateApplication);
  app.get("/api/applications/stats", handleGetApplicationStats);
  app.get("/api/applications/check/:jobId", handleCheckJobSaved);
  app.get("/api/applications/:id", handleGetApplicationById);
  app.put("/api/applications/:id", handleUpdateApplication);
  app.delete("/api/applications/:id", handleDeleteApplication);

  // ============================================================================
  // PROFILE ROUTES
  // ============================================================================
  app.get("/api/profile", handleGetProfile);
  app.put("/api/profile", handleUpdateProfile);
  app.post("/api/profile/avatar", handleUploadAvatar);
  app.get("/api/profile/stats", handleGetProfileStats);
  app.delete("/api/profile", handleDeleteAccount);
  app.get("/api/profile/export", handleExportData);

  return app;
}
