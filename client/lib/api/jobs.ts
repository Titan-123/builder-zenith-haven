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
    try {
      const params = new URLSearchParams();

      // Add filters to params
      if (filters.role) params.append("role", filters.role);
      if (filters.location) params.append("location", filters.location);
      if (filters.experience) params.append("experience", filters.experience);
      if (filters.salaryRange)
        params.append("salaryRange", filters.salaryRange);
      if (filters.portal) params.append("portal", filters.portal);
      if (filters.search) params.append("search", filters.search);
      if (filters.locationSearch)
        params.append("locationSearch", filters.locationSearch);

      // Add pagination params
      if (pagination.page) params.append("page", pagination.page.toString());
      if (pagination.limit) params.append("limit", pagination.limit.toString());
      if (pagination.sortBy) params.append("sortBy", pagination.sortBy);
      if (pagination.sortOrder)
        params.append("sortOrder", pagination.sortOrder);

      const response = await fetch(
        `${API_BASE}/jobs/search?${params.toString()}`,
        getFetchConfig(),
      );
      const result: ApiResponse<JobSearchResponse> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to search jobs");
      }

      return result.data!;
    } catch (error) {
      // Fallback to mock data when backend is unavailable
      console.warn("Backend unavailable, using mock data:", error);
      return this.getMockJobSearchResponse(filters, pagination);
    }
  }

  private getMockJobSearchResponse(
    filters: JobFilters,
    pagination: PaginationParams,
  ): JobSearchResponse {
    const mockJobs: Job[] = [
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
      {
        id: "2",
        title: "Full Stack Developer",
        company: "StartupXYZ",
        location: "New York, NY",
        salary: "$90,000 - $140,000",
        experience: "3-7 years",
        type: "Full-time",
        description: "Join our growing team as a Full Stack Developer...",
        requirements: ["React", "Node.js", "PostgreSQL"],
        benefits: ["Health Insurance", "Stock Options"],
        portal: "LinkedIn",
        postedDate: "2024-01-14",
        applicationDeadline: "2024-02-14",
        isRemote: true,
        applicationUrl: "https://example.com/apply",
      },
    ];

    // Apply basic filtering
    let filteredJobs = mockJobs;
    if (filters.search) {
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
          job.company.toLowerCase().includes(filters.search!.toLowerCase()),
      );
    }

    return {
      jobs: filteredJobs,
      total: filteredJobs.length,
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      totalPages: Math.ceil(filteredJobs.length / (pagination.limit || 10)),
    };
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
