// File Path: apps/frontend/src/services/adminService.ts
import apiClient from "@/lib/apiClient";
import { PropertyWithLister } from "@/lib/definitions";

/**
 * Fetches all properties with a 'PENDING' status.
 * Requires ADMIN authentication.
 */
export const getPendingProperties = async (): Promise<PropertyWithLister[]> => {
  const response = await apiClient.get("/admin/properties/pending");
  return response.data.data;
};

/**
 * Updates the status of a specific property.
 * Requires ADMIN authentication.
 * @param id - The ID of the property to update.
 * @param status - The new status ('APPROVED' or 'REJECTED').
 */
export const updatePropertyStatus = async (
  id: number,
  status: "APPROVED" | "REJECTED"
): Promise<PropertyWithLister> => {
  const response = await apiClient.patch(`/admin/properties/${id}/status`, {
    status,
  });
  return response.data.data;
};
