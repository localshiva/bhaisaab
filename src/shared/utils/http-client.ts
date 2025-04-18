import axios, { AxiosRequestConfig } from "axios";

// Determine base URL dynamically
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}/api`;
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`;
  }

  // For local development
  return "http://localhost:3001/api";
};

// Default config for the axios instance
const axiosConfig: AxiosRequestConfig = {
  baseURL: getBaseUrl(),
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000, // 30 seconds
};

// Create and export axios instance with default config
const httpClient = axios.create(axiosConfig);

export default httpClient;
