import { RequestHandler } from "express";
import {
  User,
  UpdateProfileRequest,
  ProfileStatsResponse,
  ApiResponse,
} from "@shared/api";

// Mock users database (same as in auth.ts)
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Helper to verify mock JWT token
const mockTokens: Record<string, string> = {};
function verifyMockToken(token: string): string | null {
  return mockTokens[token] || "1"; // For demo, always return user "1"
}

export const handleGetProfile: RequestHandler = (req, res) => {
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

    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: "User not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user,
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

export const handleUpdateProfile: RequestHandler = (req, res) => {
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

    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      const response: ApiResponse = {
        success: false,
        message: "User not found",
      };
      return res.status(404).json(response);
    }

    const data = req.body as UpdateProfileRequest;
    const user = mockUsers[userIndex];

    // Update user data
    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.avatar) user.avatar = data.avatar;
    user.updatedAt = new Date().toISOString();

    mockUsers[userIndex] = user;

    const response: ApiResponse<User> = {
      success: true,
      data: user,
      message: "Profile updated successfully",
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

export const handleUploadAvatar: RequestHandler = (req, res) => {
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

    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      const response: ApiResponse = {
        success: false,
        message: "User not found",
      };
      return res.status(404).json(response);
    }

    // In production, handle file upload to cloud storage
    // For demo, just set a placeholder URL
    const user = mockUsers[userIndex];
    user.avatar = `https://example.com/avatars/${userId}.jpg`;
    user.updatedAt = new Date().toISOString();

    mockUsers[userIndex] = user;

    const response: ApiResponse<User> = {
      success: true,
      data: user,
      message: "Avatar uploaded successfully",
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

export const handleGetProfileStats: RequestHandler = (req, res) => {
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

    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: "User not found",
      };
      return res.status(404).json(response);
    }

    // Mock stats - in production, calculate from applications data
    const stats: ProfileStatsResponse = {
      applicationsCount: 12,
      interviewsCount: 3,
      offersCount: 1,
      successRate: 25, // (3/12) * 100
      joinDate: user.createdAt,
    };

    const response: ApiResponse<ProfileStatsResponse> = {
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

export const handleDeleteAccount: RequestHandler = (req, res) => {
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

    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      const response: ApiResponse = {
        success: false,
        message: "User not found",
      };
      return res.status(404).json(response);
    }

    // Remove user from mock database
    mockUsers.splice(userIndex, 1);

    // Invalidate token
    delete mockTokens[token];

    const response: ApiResponse = {
      success: true,
      message: "Account deleted successfully",
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

export const handleExportData: RequestHandler = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No authorization token provided" });
    }

    const token = authHeader.substring(7);
    const userId = verifyMockToken(token);

    if (!userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create export data
    const exportData = {
      user,
      applications: [], // In production, fetch user's applications
      exportDate: new Date().toISOString(),
    };

    // Set headers for file download
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="jobtracker-export-${userId}.json"`,
    );

    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
