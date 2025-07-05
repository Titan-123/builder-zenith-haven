import { RequestHandler } from "express";
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  ChangePasswordRequest,
  User,
  ApiResponse,
} from "@shared/api";

// Mock user database - in production, use real database
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

const mockTokens: Record<string, string> = {};

// Helper to generate mock JWT token
function generateMockToken(userId: string): string {
  const token = `mock_token_${userId}_${Date.now()}`;
  mockTokens[token] = userId;
  return token;
}

// Helper to verify mock JWT token
function verifyMockToken(token: string): string | null {
  return mockTokens[token] || null;
}

export const handleRegister: RequestHandler = (req, res) => {
  try {
    const data = req.body as RegisterRequest;

    // Validation
    if (!data.name || !data.email || !data.password) {
      const response: ApiResponse = {
        success: false,
        message: "Name, email, and password are required",
      };
      return res.status(400).json(response);
    }

    if (data.password !== data.confirmPassword) {
      const response: ApiResponse = {
        success: false,
        message: "Passwords do not match",
      };
      return res.status(400).json(response);
    }

    // Check if user already exists
    if (mockUsers.find((u) => u.email === data.email)) {
      const response: ApiResponse = {
        success: false,
        message: "User with this email already exists",
      };
      return res.status(400).json(response);
    }

    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name: data.name,
      email: data.email,
      avatar: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    // Generate token
    const token = generateMockToken(newUser.id);

    const authResponse: AuthResponse = {
      user: newUser,
      token,
    };

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: authResponse,
      message: "Registration successful",
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

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const data = req.body as LoginRequest;

    // Validation
    if (!data.email || !data.password) {
      const response: ApiResponse = {
        success: false,
        message: "Email and password are required",
      };
      return res.status(400).json(response);
    }

    // Find user
    const user = mockUsers.find((u) => u.email === data.email);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid email or password",
      };
      return res.status(401).json(response);
    }

    // In production, verify password hash
    // For demo, we'll just check if password is not empty
    if (!data.password) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid email or password",
      };
      return res.status(401).json(response);
    }

    // Generate token
    const token = generateMockToken(user.id);

    const authResponse: AuthResponse = {
      user,
      token,
    };

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: authResponse,
      message: "Login successful",
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

export const handleGoogleLogin: RequestHandler = (req, res) => {
  try {
    const { token } = req.body;

    // In production, verify Google token
    // For demo, create or find user based on mock data
    let user = mockUsers.find((u) => u.email === "google@example.com");

    if (!user) {
      user = {
        id: (mockUsers.length + 1).toString(),
        name: "Google User",
        email: "google@example.com",
        avatar: "https://example.com/avatar.jpg",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockUsers.push(user);
    }

    const authToken = generateMockToken(user.id);

    const authResponse: AuthResponse = {
      user,
      token: authToken,
    };

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: authResponse,
      message: "Google login successful",
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Google login failed",
    };
    res.status(500).json(response);
  }
};

export const handleGetCurrentUser: RequestHandler = (req, res) => {
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

export const handleChangePassword: RequestHandler = (req, res) => {
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

    const data = req.body as ChangePasswordRequest;

    // Validation
    if (!data.currentPassword || !data.newPassword) {
      const response: ApiResponse = {
        success: false,
        message: "Current password and new password are required",
      };
      return res.status(400).json(response);
    }

    if (data.newPassword !== data.confirmPassword) {
      const response: ApiResponse = {
        success: false,
        message: "New passwords do not match",
      };
      return res.status(400).json(response);
    }

    // In production, verify current password and update with new hash
    const response: ApiResponse = {
      success: true,
      message: "Password changed successfully",
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

export const handleLogout: RequestHandler = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      // Invalidate token
      delete mockTokens[token];
    }

    const response: ApiResponse = {
      success: true,
      message: "Logout successful",
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
