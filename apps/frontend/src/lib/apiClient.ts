// File Path: apps/frontend/src/lib/apiClient.ts
import axios from "axios";

const isServer = typeof window === "undefined";

const baseURL = isServer
  ? "http://rentverse_core_service:8080/api"
  : "http://127.0.0.1:8080/api";

console.log(
  `API client initialized for ${isServer ? "SERVER" : "CLIENT"} environment. Base URL: ${baseURL}`
);

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

// CORRECTED: The token parameter is now explicitly typed to accept a string or null.
export const setAuthHeader = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // This will now correctly handle the case when null is passed on logout.
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export default apiClient;
