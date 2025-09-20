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
  // In a real-world scenario, you would first upload the files from `data.images`
  // to a service like AWS S3 and get back an array of URLs.
  // For this MVP, we will simulate this by sending placeholder image URLs.
  const imageUrls = [
    {
      imageUrl:
        "https://placehold.co/600x400/F99933/FFFFFF/jpg?text=Main+Photo",
      displayOrder: 0,
    },
    {
      imageUrl: "https://placehold.co/600x400/F99933/FFFFFF/jpg?text=Kitchen",
      displayOrder: 1,
    },
  ];

  // We construct the payload that our backend API expects.
  // We exclude the client-side `images` FileList.
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
    projectId: data.projectId,
    viewIds: data.viewIds?.map((id) => Number(id)),
    amenityIds: data.amenityIds?.map((id) => Number(id)),
    ownershipDocumentUrl: data.ownershipDocumentUrl,
    images: imageUrls, // We send the (simulated) URLs
  };

  const response = await apiClient.post("/properties", payload);
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

export const getPropertyById = async (
  id: number
): Promise<PropertyDetailed> => {
  const response = await apiClient.get(`/properties/${id}`);
  return response.data.data;
};

export const getAmenities = async (): Promise<Amenity[]> => {
  const response = await apiClient.get("/amenities");
  return response.data.data;
};
