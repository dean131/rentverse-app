// File Path: apps/frontend/src/services/propertyService.ts
import apiClient from "@/lib/apiClient";
import { Project, View, PropertySubmission } from "@/lib/definitions";

/**
 * Fetches all available projects for the dropdown.
 * Requires authentication.
 */
export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get("/projects");
  return response.data.data;
};

/**
 * Fetches all available property views for the checklist.
 * Requires authentication.
 */
export const getViews = async (): Promise<View[]> => {
  // Assuming a /views endpoint exists as per the API contract
  const response = await apiClient.get("/views");
  return response.data.data;
};

/**
 * Submits a new property listing to the backend.
 * Requires authentication.
 * @param data - The property data from the form.
 */
export const submitProperty = async (data: PropertySubmission) => {
  // The backend expects certain fields to be numbers, so we ensure conversion.
  const transformedData = {
    ...data,
    rentalPrice: data.rentalPrice ? Number(data.rentalPrice) : undefined,
    sizeSqft: Number(data.sizeSqft),
    bedrooms: Number(data.bedrooms),
    bathrooms: Number(data.bathrooms),
    projectId: data.projectId ? Number(data.projectId) : undefined,
    // TODO: Add ownershipDocumentUrl and location data here
    // This is a placeholder for the file upload logic we will add later.
    ownershipDocumentUrl: "https://example.com/doc.pdf",
    latitude: -6.2,
    longitude: 106.8,
  };

  const response = await apiClient.post("/properties", transformedData);
  return response.data.data;
};
