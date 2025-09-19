// File Path: apps/frontend/src/lib/apiClient.ts
import axios from "axios";

// --- Dynamic Base URL ---
// This is the key to making our app work both for server-side rendering
// inside Docker and for client-side requests from the browser.

// Check if the code is running on the server or the client
const isServer = typeof window === "undefined";

// If on the server, use the Docker service name. If on the client, use localhost.
const baseURL = isServer
  ? "http://rentverse_core_service:8080/api"
  : "http://127.0.0.1:8080/api";

console.log(
  `API client initialized for ${isServer ? "SERVER" : "CLIENT"} environment. Base URL: ${baseURL}`
);

const apiClient = axios.create({
  baseURL,
  withCredentials: true, // Important for sending cookies
});

// Helper function to set the authorization header
export const setAuthHeader = (token: string) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export default apiClient;
