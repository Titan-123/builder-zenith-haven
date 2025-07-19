import {
  Job,
  JobFilters,
  JobSearchResponse,
  PaginationParams,
  ApiResponse,
} from "@shared/api";
import { authAPI } from "./auth";

import { API_CONFIG } from "./config";

const API_BASE = API_CONFIG.BASE_URL;

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

class JobsAPI {
  async searchJobs(
    filters: JobFilters = {},
    pagination: PaginationParams = {},
  ): Promise<JobSearchResponse> {
    const params = new URLSearchParams();

    // Add filters to params
    if (filters.role) params.append("role", filters.role);
    if (filters.location) params.append("location", filters.location);
    if (filters.experience) params.append("experience", filters.experience);
    if (filters.salaryRange) params.append("salaryRange", filters.salaryRange);
    if (filters.portal) params.append("portal", filters.portal);
    if (filters.search) params.append("search", filters.search);
    if (filters.locationSearch)
      params.append("locationSearch", filters.locationSearch);

    // Add pagination params
    if (pagination.page) params.append("page", pagination.page.toString());
    if (pagination.limit) params.append("limit", pagination.limit.toString());
    if (pagination.sortBy) params.append("sortBy", pagination.sortBy);
    if (pagination.sortOrder) params.append("sortOrder", pagination.sortOrder);

    const response = await fetch(
      `${API_BASE}/jobs/search?${params.toString()}`,
      getFetchConfig(),
    );
    const result: ApiResponse<JobSearchResponse> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to search jobs");
    }

    return result.data!;
  }

  async getJobById(id: string): Promise<Job> {
    const response = await fetch(`${API_BASE}/jobs/${id}`);
    const result: ApiResponse<Job> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to get job details");
    }

    return result.data!;
  }

  async getFeaturedJobs(limit = 6): Promise<Job[]> {
    const response = await fetch(`${API_BASE}/jobs/featured?limit=${limit}`);
    const result: ApiResponse<Job[]> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to get featured jobs");
    }

    return result.data!;
  }

  async getRecommendedJobs(limit = 10): Promise<Job[]> {
    const token = authAPI.getToken();

    const response = await fetch(
      `${API_BASE}/jobs/recommended?limit=${limit}`,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      },
    );

    const result: ApiResponse<Job[]> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to get recommended jobs");
    }

    return result.data!;
  }

  async getJobPortals(): Promise<string[]> {
    const response = await fetch(`${API_BASE}/jobs/portals`);
    const result: ApiResponse<string[]> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to get job portals");
    }

    return result.data!;
  }

  async getJobStats(): Promise<{
    totalJobs: number;
    newJobsToday: number;
    companiesHiring: number;
    averageSalary: string;
  }> {
    const response = await fetch(`${API_BASE}/jobs/stats`);
    const result: ApiResponse<any> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to get job stats");
    }

    return result.data!;
  }
}

export const jobsAPI = new JobsAPI();
