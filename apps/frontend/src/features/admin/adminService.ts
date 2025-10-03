// File Path: apps/frontend/src/services/adminService.ts
import { PaginatedUsersResponse } from "@/lib/definitions";
import apiClient from "@/lib/apiClient";
import {
  PropertyWithLister,
  StatusUpdatePayload,
  AdminDashboardStats,
} from "@/lib/definitions";

export const getPendingProperties = async (): Promise<PropertyWithLister[]> => {
  const response = await apiClient.get("/admin/properties/pending");
  return response.data.data;
};

// NEW: Function to update a property's status
export const updatePropertyStatus = async (
  id: number,
  status: "APPROVED" | "REJECTED"
): Promise<void> => {
  const payload: StatusUpdatePayload = { status };
  await apiClient.patch(`/admin/properties/${id}/status`, payload);
};

export const getAdminDashboardStats =
  async (): Promise<AdminDashboardStats> => {
    const response = await apiClient.get("/admin/dashboard/stats");
    return response.data.data;
  };

export const getUsers = async (
  page: number
): Promise<PaginatedUsersResponse> => {
  const response = await apiClient.get(`/admin/users?page=${page}`);
  return response.data.data;
};
