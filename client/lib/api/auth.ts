import {
  User,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  ChangePasswordRequest,
  ApiResponse,
} from "@shared/api";

const API_BASE = "http://localhost:5000";

// Common fetch configuration for CORS
const getFetchConfig = (options: RequestInit = {}): RequestInit => ({
  ...options,
  mode: "cors",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    ...options.headers,
  },
});

class AuthAPI {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(
      `${API_BASE}/auth/register`,
      getFetchConfig({
        method: "POST",
        body: JSON.stringify(data),
      }),
    );

    const result: ApiResponse<AuthResponse> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Registration failed");
    }

    // Store token in localStorage
    if (result.data?.token) {
      localStorage.setItem("auth_token", result.data.token);
    }

    return result.data!;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(
      `${API_BASE}/auth/login`,
      getFetchConfig({
        method: "POST",
        body: JSON.stringify(data),
      }),
    );

    const result: ApiResponse<AuthResponse> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Login failed");
    }

    // Store token in localStorage
    if (result.data?.token) {
      localStorage.setItem("auth_token", result.data.token);
    }

    return result.data!;
  }

  async googleLogin(token: string): Promise<AuthResponse> {
    const response = await fetch(
      `${API_BASE}/auth/google`,
      getFetchConfig({
        method: "POST",
        body: JSON.stringify({ token }),
      }),
    );

    const result: ApiResponse<AuthResponse> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Google login failed");
    }

    // Store token in localStorage
    if (result.data?.token) {
      localStorage.setItem("auth_token", result.data.token);
    }

    return result.data!;
  }

  async getCurrentUser(): Promise<User> {
    const token = this.getToken();

    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result: ApiResponse<User> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to get user");
    }

    return result.data!;
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    const token = this.getToken();

    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to change password");
    }
  }

  async logout(): Promise<void> {
    const token = this.getToken();

    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } finally {
      // Always remove token from localStorage
      localStorage.removeItem("auth_token");
    }
  }

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
}

export const authAPI = new AuthAPI();
