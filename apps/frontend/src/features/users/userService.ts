// File Path: apps/frontend/src/services/userService.ts
import apiClient from "@/lib/apiClient";
import { OwnerDashboardStats } from "@/lib/definitions";

/**
 * Fetches the dashboard statistics for the currently logged-in user.
 * The backend will automatically determine the user's role and return the correct data.
 * @returns {Promise<OwnerDashboardStats>} A promise that resolves to the user's dashboard stats.
 */
export const getUserDashboardStats = async (): Promise<OwnerDashboardStats> => {
  const response = await apiClient.get("/users/me/dashboard");
  return response.data.data;
};
