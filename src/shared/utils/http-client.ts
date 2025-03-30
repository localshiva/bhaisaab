import axios, { AxiosRequestConfig } from "axios";

import { clientEnv } from "./env-vars/client.env";

// Default config for the axios instance
const axiosConfig: AxiosRequestConfig = {
  baseURL: clientEnv.NEXT_PUBLIC_API_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000, // 30 seconds
};

// Create and export axios instance with default config
const httpClient = axios.create(axiosConfig);

export default httpClient;
