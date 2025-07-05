import {
  User,
  UpdateProfileRequest,
  ProfileStatsResponse,
  ApiResponse,
} from "@shared/api";
import { authAPI } from "./auth";

const API_BASE = "/api";

class ProfileAPI {
  private getAuthHeaders(): Record<string, string> {
    const token = authAPI.getToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getProfile(): Promise<User> {
    const response = await fetch(`${API_BASE}/profile`, {
      headers: this.getAuthHeaders(),
    });

    const result: ApiResponse<User> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to get profile");
    }

    return result.data!;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await fetch(`${API_BASE}/profile`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<User> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update profile");
    }

    return result.data!;
  }

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append("avatar", file);

    const token = authAPI.getToken();
    const response = await fetch(`${API_BASE}/profile/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result: ApiResponse<User> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to upload avatar");
    }

    return result.data!;
  }

  async getProfileStats(): Promise<ProfileStatsResponse> {
    const response = await fetch(`${API_BASE}/profile/stats`, {
      headers: this.getAuthHeaders(),
    });

    const result: ApiResponse<ProfileStatsResponse> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to get profile stats");
    }

    return result.data!;
  }

  async deleteAccount(): Promise<void> {
    const response = await fetch(`${API_BASE}/profile`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    const result: ApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete account");
    }

    // Clear auth token on successful account deletion
    authAPI.logout();
  }

  async exportData(): Promise<Blob> {
    const response = await fetch(`${API_BASE}/profile/export`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to export data");
    }

    return response.blob();
  }
}

export const profileAPI = new ProfileAPI();
