import axios, { AxiosRequestConfig } from "axios";

// Determine base URL dynamically
const getBaseUrl = () => {
  // For Vercel deployments (preview or production)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`;
  }

  // For local development
  return "http://localhost:3001/api";
};

console.info("===== process ======", process.env);

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
