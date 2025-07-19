// Main API exports for easy imports
export { authAPI } from "./auth";
export { jobsAPI } from "./jobs";
export { applicationsAPI } from "./applications";
export { profileAPI } from "./profile";

// Re-export types
export * from "@shared/api";

// API configuration
export const API_CONFIG = {
  BASE_URL: "http://localhost:5000",
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
};

// Error handling utility
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Generic API call wrapper with error handling
export async function apiCall<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new APIError(
        result.message || "API call failed",
        response.status,
        result.errors,
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError("Network error or invalid response");
  }
}
