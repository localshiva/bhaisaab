import axios, { AxiosRequestConfig } from "axios";

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

  return "http://localhost:3001/api";
};

const axiosConfig: AxiosRequestConfig = {
  baseURL: getBaseUrl(),
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
};

/** Axios instance for the app's own `/api` routes. */
const httpClient = axios.create(axiosConfig);

export default httpClient;
