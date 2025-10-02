// File Path: apps/frontend/src/services/propertyService.ts
import apiClient from "@/lib/apiClient";
import {
  PropertySubmission,
  Project,
  View,
  Amenity,
  PropertyPublic,
  PropertyDetailed,
  RawPropertyFromAPI,
  PropertyFilters,
  OwnerProperty,
  PaginatedResponse,
} from "@/lib/definitions";

/**
 * Fetches a list of projects from the backend.
 */
export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get("/projects");
  return response.data.data;
};

/**
 * Fetches a list of available property views from the backend.
 */
export const getViews = async (): Promise<View[]> => {
  const response = await apiClient.get("/views");
  return response.data.data;
};

/**
 * Fetches a list of available amenities from the backend.
 */
export const getAmenities = async (): Promise<Amenity[]> => {
  const response = await apiClient.get("/amenities");
  return response.data.data;
};

/**
 * Submits a new property listing to the backend.
 * This simulates a file upload process by creating placeholder URLs.
 */
export const submitProperty = async (
  data: PropertySubmission
): Promise<PropertyDetailed> => {
  const imageUrls = (data.images as string[]).map((url, index) => ({
    imageUrl: url,
    displayOrder: index,
  }));

  const payload = {
    ...data,
    projectId: data.projectId ? Number(data.projectId) : null,
    viewIds: data.viewIds?.map((id) => Number(id)),
    amenityIds: data.amenityIds?.map((id) => Number(id)),
    images: imageUrls,
  };

  const response = await apiClient.post("/properties", payload);
  return response.data.data;
};

/**
 * Fetches a list of publicly available, approved properties with optional filters.
 */
export const getPublicProperties = async (
  filters: PropertyFilters = {}
): Promise<PaginatedResponse<PropertyPublic>> => {
  const params = new URLSearchParams();
  if (filters.search) {
    params.append("search", filters.search);
  }
  // Add listingType to the params if it exists
  if (filters.listingType) {
    params.append("listingType", filters.listingType);
  }
  // The existing filter for property type (Apartment, House, etc.)
  if (filters.propertyType && filters.propertyType !== "ALL") {
    params.append("propertyType", filters.propertyType);
  }
  if (filters.beds) {
    params.append("beds", filters.beds);
  }
  if (filters.page) {
    params.append("page", filters.page.toString());
  }

  const response = await apiClient.get(`/properties?${params.toString()}`);

  const paginatedData = response.data.data;

  const mappedItems = paginatedData.items.map((p: RawPropertyFromAPI) => ({
    ...p,
    address: p.project?.address || p.address || "Address not available",
  }));

  return {
    ...paginatedData,
    items: mappedItems,
  };
};

/**
 * Fetches the full, detailed information for a single property by its ID.
 */
export const getPropertyById = async (
  id: number
): Promise<PropertyDetailed> => {
  const response = await apiClient.get(`/properties/${id}`);
  return response.data.data;
};

/**
 * Fetches all properties listed by the currently authenticated owner.
 */
export const getOwnerProperties = async (): Promise<OwnerProperty[]> => {
  const response = await apiClient.get("/properties/mine/my-properties");
  return response.data.data;
};
