// API configuration - environment aware
const getBaseURL = () => {
  // Only use localhost:5001 if running on actual localhost AND not in hosted environment
  if (
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1") &&
    !window.location.href.includes("fly.dev")
  ) {
    return "http://localhost:5001/api";
  }
  // For hosted development environments (like fly.dev), use the netlify functions
  return "/api";
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
};

// Helper to check if we're using local backend
export const isUsingLocalBackend = () => {
  return API_CONFIG.BASE_URL.includes("localhost:5001");
};

// Debug logging in development
console.log("🔗 API Configuration:", {
  baseURL: API_CONFIG.BASE_URL,
  isLocal: isUsingLocalBackend(),
  hostname: window.location.hostname,
  environment: import.meta.env.MODE,
  currentURL: window.location.href,
});
