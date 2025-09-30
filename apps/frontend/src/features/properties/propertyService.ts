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
  // In a real-world scenario, you would first upload the files from `data.images`
  // to a service like AWS S3 and get back an array of URLs.
  // We simulate this by creating placeholder URLs based on the file names.
  const imageUrls = (data.images as string[]).map((url, index) => ({
    imageUrl: url,
    displayOrder: index,
  }));

  // We construct the payload that our backend API expects.
  const payload = {
    title: data.title,
    description: data.description,
    listingType: data.listingType,
    propertyType: data.propertyType,
    rentalPrice: data.rentalPrice,
    paymentPeriod: data.paymentPeriod,
    sizeSqft: data.sizeSqft,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    furnishingStatus: data.furnishingStatus,
    projectId: data.projectId ? Number(data.projectId) : null,
    viewIds: data.viewIds?.map((id) => Number(id)),
    amenityIds: data.amenityIds?.map((id) => Number(id)),
    ownershipDocumentUrl: data.ownershipDocumentUrl,
    images: imageUrls, // We send the (simulated) URLs
  };

  const response = await apiClient.post("/properties", payload);
  return response.data.data;
};

/**
 * Fetches a list of publicly available, approved properties with optional filters.
 */

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

  if (filters.beds) {
    params.append("beds", filters.beds);
  }

  const response = await apiClient.get(`/properties?${params.toString()}`);

  return response.data.data.map((p: RawPropertyFromAPI) => ({
    ...p,
    address: p.project?.address || "Address not available",
  }));
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
