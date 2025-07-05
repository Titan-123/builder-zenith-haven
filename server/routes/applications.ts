import { RequestHandler } from "express";
import {
  Application,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  ApplicationsResponse,
  ApiResponse,
} from "@shared/api";

// Mock applications database
const mockApplications: Application[] = [
  {
    id: "1",
    userId: "1",
    jobId: "1",
    job: {
      id: "1",
      title: "Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$80,000 - $120,000",
      type: "Full-time",
      portal: "LinkedIn",
      portalUrl: "https://linkedin.com/jobs/123456",
      description: "Build modern web applications...",
      requirements: [],
      benefits: [],
      postedDate: "2024-01-15T10:00:00Z",
      companyInfo: {
        size: "500-1000 employees",
        industry: "Technology",
        founded: "2015",
      },
    },
    status: "Interview",
    appliedDate: "2024-01-15T10:00:00Z",
    notes:
      "Had initial phone screening, technical interview scheduled for next week.",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "1",
    jobId: "2",
    job: {
      id: "2",
      title: "UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      salary: "$70,000 - $100,000",
      type: "Full-time",
      portal: "Indeed",
      portalUrl: "https://indeed.com/job/789012",
      description: "Create user-centered designs...",
      requirements: [],
      benefits: [],
      postedDate: "2024-01-14T14:30:00Z",
      companyInfo: {
        size: "50-100 employees",
        industry: "Design",
        founded: "2018",
      },
    },
    status: "Applied",
    appliedDate: "2024-01-12T10:00:00Z",
    notes: "Submitted portfolio and cover letter.",
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
  },
];

// Helper to verify mock JWT token (same as in auth.ts)
const mockTokens: Record<string, string> = {};
function verifyMockToken(token: string): string | null {
  return mockTokens[token] || "1"; // For demo, always return user "1"
}

export const handleGetApplications: RequestHandler = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const response: ApiResponse = {
        success: false,
        message: "No authorization token provided",
      };
      return res.status(401).json(response);
    }

    const token = authHeader.substring(7);
    const userId = verifyMockToken(token);

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid token",
      };
      return res.status(401).json(response);
    }

    const userApplications = mockApplications.filter(
      (app) => app.userId === userId,
    );

    const stats = {
      applied: userApplications.filter((app) => app.status === "Applied")
        .length,
      interview: userApplications.filter((app) => app.status === "Interview")
        .length,
      rejected: userApplications.filter((app) => app.status === "Rejected")
        .length,
      offer: userApplications.filter((app) => app.status === "Offer").length,
    };

    const applicationsResponse: ApplicationsResponse = {
      applications: userApplications,
      total: userApplications.length,
      stats,
    };

    const response: ApiResponse<ApplicationsResponse> = {
      success: true,
      data: applicationsResponse,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const handleGetApplicationById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const response: ApiResponse = {
        success: false,
        message: "No authorization token provided",
      };
      return res.status(401).json(response);
    }

    const token = authHeader.substring(7);
    const userId = verifyMockToken(token);

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid token",
      };
      return res.status(401).json(response);
    }

    const application = mockApplications.find(
      (app) => app.id === id && app.userId === userId,
    );

    if (!application) {
      const response: ApiResponse = {
        success: false,
        message: "Application not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Application> = {
      success: true,
      data: application,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const handleCreateApplication: RequestHandler = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const response: ApiResponse = {
        success: false,
        message: "No authorization token provided",
      };
      return res.status(401).json(response);
    }

    const token = authHeader.substring(7);
    const userId = verifyMockToken(token);

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid token",
      };
      return res.status(401).json(response);
    }

    const data = req.body as CreateApplicationRequest;

    // Check if application already exists
    const existingApp = mockApplications.find(
      (app) => app.userId === userId && app.jobId === data.jobId,
    );

    if (existingApp) {
      const response: ApiResponse = {
        success: false,
        message: "You have already applied to this job",
      };
      return res.status(400).json(response);
    }

    // Create new application (in production, would also fetch job details)
    const newApplication: Application = {
      id: (mockApplications.length + 1).toString(),
      userId,
      jobId: data.jobId,
      job: {
        id: data.jobId,
        title: "Sample Job",
        company: "Sample Company",
        location: "Sample Location",
        salary: "$50,000 - $80,000",
        type: "Full-time",
        portal: "Sample Portal",
        portalUrl: "https://example.com",
        description: "Sample job description",
        requirements: [],
        benefits: [],
        postedDate: new Date().toISOString(),
        companyInfo: {
          size: "100-500 employees",
          industry: "Technology",
          founded: "2020",
        },
      },
      status: "Applied",
      appliedDate: new Date().toISOString(),
      notes: data.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockApplications.push(newApplication);

    const response: ApiResponse<Application> = {
      success: true,
      data: newApplication,
      message: "Application created successfully",
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const handleUpdateApplication: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const response: ApiResponse = {
        success: false,
        message: "No authorization token provided",
      };
      return res.status(401).json(response);
    }

    const token = authHeader.substring(7);
    const userId = verifyMockToken(token);

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid token",
      };
      return res.status(401).json(response);
    }

    const applicationIndex = mockApplications.findIndex(
      (app) => app.id === id && app.userId === userId,
    );

    if (applicationIndex === -1) {
      const response: ApiResponse = {
        success: false,
        message: "Application not found",
      };
      return res.status(404).json(response);
    }

    const data = req.body as UpdateApplicationRequest;
    const application = mockApplications[applicationIndex];

    // Update application
    if (data.status) application.status = data.status;
    if (data.notes !== undefined) application.notes = data.notes;
    application.updatedAt = new Date().toISOString();

    mockApplications[applicationIndex] = application;

    const response: ApiResponse<Application> = {
      success: true,
      data: application,
      message: "Application updated successfully",
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const handleDeleteApplication: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const response: ApiResponse = {
        success: false,
        message: "No authorization token provided",
      };
      return res.status(401).json(response);
    }

    const token = authHeader.substring(7);
    const userId = verifyMockToken(token);

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid token",
      };
      return res.status(401).json(response);
    }

    const applicationIndex = mockApplications.findIndex(
      (app) => app.id === id && app.userId === userId,
    );

    if (applicationIndex === -1) {
      const response: ApiResponse = {
        success: false,
        message: "Application not found",
      };
      return res.status(404).json(response);
    }

    mockApplications.splice(applicationIndex, 1);

    const response: ApiResponse = {
      success: true,
      message: "Application deleted successfully",
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const handleCheckJobSaved: RequestHandler = (req, res) => {
  try {
    const { jobId } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const response: ApiResponse = {
        success: false,
        message: "No authorization token provided",
      };
      return res.status(401).json(response);
    }

    const token = authHeader.substring(7);
    const userId = verifyMockToken(token);

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid token",
      };
      return res.status(401).json(response);
    }

    const saved = mockApplications.some(
      (app) => app.userId === userId && app.jobId === jobId,
    );

    const response: ApiResponse<{ saved: boolean }> = {
      success: true,
      data: { saved },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const handleGetApplicationStats: RequestHandler = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const response: ApiResponse = {
        success: false,
        message: "No authorization token provided",
      };
      return res.status(401).json(response);
    }

    const token = authHeader.substring(7);
    const userId = verifyMockToken(token);

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid token",
      };
      return res.status(401).json(response);
    }

    const userApplications = mockApplications.filter(
      (app) => app.userId === userId,
    );

    const stats = {
      total: userApplications.length,
      applied: userApplications.filter((app) => app.status === "Applied")
        .length,
      interview: userApplications.filter((app) => app.status === "Interview")
        .length,
      rejected: userApplications.filter((app) => app.status === "Rejected")
        .length,
      offer: userApplications.filter((app) => app.status === "Offer").length,
      successRate:
        userApplications.length > 0
          ? Math.round(
              (userApplications.filter((app) => app.status === "Offer").length /
                userApplications.length) *
                100,
            )
          : 0,
    };

    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};
