// API configuration - environment aware
const getBaseURL = () => {
  // Check if we're in development and localhost:5000 is available
  if (import.meta.env.DEV && window.location.hostname === "localhost") {
    return "http://localhost:5001/api";
  }
  // Fall back to relative API paths for production/hosted environments
  return "/api";
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
};

// Helper to check if we're using local backend
export const isUsingLocalBackend = () => {
  return API_CONFIG.BASE_URL.includes("localhost:5000");
};

// Debug logging in development
if (import.meta.env.DEV) {
  console.log("🔗 API Configuration:", {
    baseURL: API_CONFIG.BASE_URL,
    isLocal: isUsingLocalBackend(),
    hostname: window.location.hostname,
    environment: import.meta.env.MODE,
  });
}
