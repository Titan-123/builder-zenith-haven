import {
  Application,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  ApplicationsResponse,
  ApiResponse,
} from "@shared/api";
import { authAPI } from "./auth";

import { API_CONFIG } from "./config";

const API_BASE = API_CONFIG.BASE_URL;

class ApplicationsAPI {
  private getAuthHeaders(): Record<string, string> {
    const token = authAPI.getToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getApplications(): Promise<ApplicationsResponse> {
    const response = await fetch(`${API_BASE}/applications`, {
      headers: this.getAuthHeaders(),
    });

    const result: ApiResponse<ApplicationsResponse> = await response.json();

    if (!response.ok ) {
      throw new Error(result.message || "Failed to get applications");
    }

    console.log(result);

    return result.data!;
  }

  async getApplicationById(id: string): Promise<Application> {
    const response = await fetch(`${API_BASE}/applications/${id}`, {
      headers: this.getAuthHeaders(),
    });

    const result: ApiResponse<Application> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to get application");
    }

    return result.data!;
  }

  async createApplication(
    data: CreateApplicationRequest,
  ): Promise<Application> {
    const response = await fetch(`${API_BASE}/applications`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Application> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to create application");
    }

    return result.data!;
  }

  async updateApplication(
    id: string,
    data: UpdateApplicationRequest,
  ): Promise<Application> {
    const response = await fetch(`${API_BASE}/applications/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Application> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update application");
    }

    return result.data!;
  }

  async deleteApplication(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/applications/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    const result: ApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete application");
    }
  }

  async updateApplicationStatus(
    id: string,
    status: string,
  ): Promise<Application> {
    return this.updateApplication(id, { status: status as any });
  }

  async updateApplicationNotes(
    id: string,
    notes: string,
  ): Promise<Application> {
    return this.updateApplication(id, { notes });
  }

  async isJobSaved(jobId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE}/applications/check/${jobId}`, {
      headers: this.getAuthHeaders(),
    });

    const result: ApiResponse<{ saved: boolean }> = await response.json();

    if (!response.ok || !result.success) {
      return false;
    }

    return result.data?.saved || false;
  }

  async getApplicationStats(): Promise<{
    total: number;
    applied: number;
    interview: number;
    rejected: number;
    offer: number;
    successRate: number;
  }> {
    const response = await fetch(`${API_BASE}/applications/stats`, {
      headers: this.getAuthHeaders(),
    });

    const result: ApiResponse<any> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to get application stats");
    }

    return result.data!;
  }
}

export const applicationsAPI = new ApplicationsAPI();
