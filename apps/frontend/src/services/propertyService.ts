// File Path: apps/frontend/src/services/propertyService.ts
import apiClient from "@/lib/apiClient";
import {
  PropertySubmission,
  Project,
  View,
  PropertyPublic,
  PropertyDetailed,
  RawPropertyFromAPI, // Import the new type
} from "@/lib/definitions";

// --- Fetch Functions (for dropdowns, etc.) ---

export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get("/projects");
  return response.data.data;
};

export const getViews = async (): Promise<View[]> => {
  const response = await apiClient.get("/views");
  return response.data.data;
};

// --- Mutation Functions (for submitting data) ---

export const submitProperty = async (
  data: PropertySubmission
): Promise<PropertyDetailed> => {
  const response = await apiClient.post("/properties", data);
  return response.data.data;
};

// --- Public Fetch Functions ---

export const getPublicProperties = async (): Promise<PropertyPublic[]> => {
  const response = await apiClient.get("/properties");
  // CORRECTED: Replaced 'any' with the specific 'RawPropertyFromAPI' type.
  return response.data.data.map((p: RawPropertyFromAPI) => ({
    ...p,
    address: p.project?.address || null, // Safely access nested address
  }));
};
