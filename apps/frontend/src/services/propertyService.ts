// File Path: apps/frontend/src/services/propertyService.ts
import apiClient from "@/lib/apiClient";
import {
  PropertySubmission,
  Project,
  View,
  PropertyPublic,
  PropertyDetailed,
  RawPropertyFromAPI,
  PropertyFilters,
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

export const getPublicProperties = async (
  filters: PropertyFilters = {}
): Promise<PropertyPublic[]> => {
  const params = new URLSearchParams();
  if (filters.search) {
    params.append("search", filters.search);
  }
  if (filters.type && filters.type !== "ALL") {
    params.append("propertyType", filters.type);
  }

  const response = await apiClient.get(`/properties?${params.toString()}`);

  return response.data.data.map((p: RawPropertyFromAPI) => ({
    ...p,
    address: p.project?.address || null,
  }));
};

// NEW: Service function to get the details of a single property
export const getPropertyById = async (
  id: number
): Promise<PropertyDetailed> => {
  const response = await apiClient.get(`/properties/${id}`);
  return response.data.data;
};
