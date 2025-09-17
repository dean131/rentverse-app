import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Crucial for sending cookies (like our refreshToken)
});

/**
 * A helper function to set or remove the Authorization header.
 * This centralizes token management instead of handling it in components.
 * @param token - The JWT access token, or null to remove it.
 */
export const setAuthHeader = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export default apiClient;
