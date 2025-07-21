// Main API exports for easy imports
export { authAPI } from "./auth";
export { jobsAPI } from "./jobs";
export { applicationsAPI } from "./applications";
export { profileAPI } from "./profile";

// Re-export types
export * from "@shared/api";

// Import API configuration
export { API_CONFIG } from "./config";

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
// export async function apiCall<T>(
//   url: string,
//   options: RequestInit = {},
// ): Promise<T> {
//   try {
//     const response = await fetch(url, {
//       ...options,
//       headers: {
//         "Content-Type": "application/json",
//         ...options.headers,
//       },
//       // Add CORS mode for cross-origin requests
//       mode: "cors",
//       credentials: "include",
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new APIError(
//         result.message || "API call failed",
//         response.status,
//         result.errors,
//       );
//     }

//     return result.data;
//   } catch (error) {
//     if (error instanceof APIError) {
//       throw error;
//     }

//     // Check if it's a network error (like CORS or connection refused)
//     if (error instanceof TypeError && error.message.includes("fetch")) {
//       throw new APIError(
//         "Unable to connect to the server. Please check if the backend is running on localhost:5000 or try refreshing the page.",
//         503,
//       );
//     }

//     throw new APIError("Network error or invalid response");
//   }
// }


export async function apiCall<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
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

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new APIError(
        "Unable to connect to the server. Please check if the backend is running on localhost:5000 or try refreshing the page.",
        503,
      );
    }

    throw new APIError("Network error or invalid response");
  }
}
