// utils/config.ts

const isProd = process.env.NODE_ENV === "production";

export const BASE_URL = isProd
  ? "https://leet-daily.netlify.app"
  : "http://localhost:3000";

// Helper function for API endpoints
export const getApiUrl = (endpoint: string) => `${BASE_URL}/api${endpoint}`;
