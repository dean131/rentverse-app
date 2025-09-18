// File Path: apps/frontend/src/services/propertyService.ts
import apiClient from "@/lib/apiClient";
import {
  PropertySubmission,
  Project,
  View,
  PropertyWithLister,
  PropertyDetailed,
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

// CORRECTED: Replaced 'any' with the specific 'PropertyDetailed' type for type safety.
export const submitProperty = async (
  data: PropertySubmission
): Promise<PropertyDetailed> => {
  // The payload now directly matches the PropertySubmission type
  const response = await apiClient.post("/properties", data);
  return response.data.data;
};

// --- Public Fetch Functions ---

export const getPublicProperties = async (): Promise<PropertyWithLister[]> => {
  const response = await apiClient.get("/properties");
  return response.data.data;
};
