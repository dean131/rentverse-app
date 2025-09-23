// File Path: apps/frontend/src/lib/apiClient.ts
import axios from "axios";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api`;

const apiClient = axios.create({
  baseURL,
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
