// File Path: apps/frontend/src/lib/apiClient.ts
import axios from "axios";

// Prefer same-origin path on the browser and absolute URL on the server (SSR).
// SSR cannot rely on window origin and may run inside Docker, so use CORE_SERVICE_URL.
const isServer = typeof window === "undefined";
const serverBase = `${
  process.env.CORE_SERVICE_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"
}/api`;

const apiClient = axios.create({
  baseURL: isServer ? serverBase : "/api",
  withCredentials: true,
});

export const setAuthHeader = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export default apiClient;
