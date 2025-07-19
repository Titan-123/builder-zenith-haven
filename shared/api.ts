/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================================================
// JOB TYPES
// ============================================================================

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  portal: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  applicationDeadline: string;
  isRemote: boolean;
  applicationUrl: string;
}

export interface JobFilters {
  role?: string;
  location?: string;
  experience?: string;
  salaryRange?: string;
  portal?: string;
  search?: string;
  locationSearch?: string;
}

export interface JobSearchResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// APPLICATION TYPES
// ============================================================================

export type ApplicationStatus = "Applied" | "Interview" | "Rejected" | "Offer";

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  job: Job;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationRequest {
  jobId: string;
  notes?: string;
}

export interface UpdateApplicationRequest {
  status?: ApplicationStatus;
  notes?: string;
}

export interface ApplicationsResponse {
  applications: Application[];
  total: number;
  stats: {
    applied: number;
    interview: number;
    rejected: number;
    offer: number;
  };
}

// ============================================================================
// PROFILE TYPES
// ============================================================================

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface ProfileStatsResponse {
  applicationsCount: number;
  interviewsCount: number;
  offersCount: number;
  successRate: number;
  joinDate: string;
}

// ============================================================================
// API RESPONSE WRAPPER
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
