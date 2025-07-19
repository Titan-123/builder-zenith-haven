// Main API exports for easy imports
export { authAPI } from "./auth";
export { jobsAPI } from "./jobs";
export { applicationsAPI } from "./applications";
export { profileAPI } from "./profile";

// Re-export types
export * from "@shared/api";

// API configuration - environment aware
const getBaseURL = () => {
  // Check if we're in development and localhost:5000 is available
  if (import.meta.env.DEV && window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  // Fall back to relative API paths for production/hosted environments
  return "/api";
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
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

// Generic API call wrapper with error handling and CORS support
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
      // Add CORS mode for cross-origin requests
      mode: "cors",
      credentials: "include",
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
