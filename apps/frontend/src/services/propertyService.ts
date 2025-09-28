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

// Normalize MinIO image base so Next.js (running inside Docker) can fetch images server-side.
// - On the server (SSR), replace loopback hosts with the Docker service host (minio:9000 by default).
// - On the client, keep public/base URL (NEXT_PUBLIC_MINIO_URL or NEXT_PUBLIC_STORAGE_SERVICE_URL) if provided.
const normalizeImageUrl = (url: string): string => {
  if (!url) return url;
  const isServer = typeof window === 'undefined';
  if (isServer) {
    const serverMinioBase = process.env.MINIO_INTERNAL_URL || 'http://minio:9000';
    if (url.startsWith('http://127.0.0.1:9000')) {
      return url.replace('http://127.0.0.1:9000', serverMinioBase);
    }
    if (url.startsWith('http://localhost:9000')) {
      return url.replace('http://localhost:9000', serverMinioBase);
    }
    return url;
  }
  // Browser: if a public base is configured, normalize to that for consistency
  const clientBase = process.env.NEXT_PUBLIC_MINIO_URL || process.env.NEXT_PUBLIC_STORAGE_SERVICE_URL;
  if (clientBase) {
    if (url.startsWith('http://127.0.0.1:9000')) {
      return url.replace('http://127.0.0.1:9000', clientBase);
    }
    if (url.startsWith('http://localhost:9000')) {
      return url.replace('http://localhost:9000', clientBase);
    }
  }
  return url;
};

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
    images: (p.images || []).map((img: { imageUrl: string }) => ({
      imageUrl: normalizeImageUrl(img.imageUrl),
    })),
  }));
};

/**
 * Fetches the full, detailed information for a single property by its ID.
 */
export const getPropertyById = async (
  id: number
): Promise<PropertyDetailed> => {
  const response = await apiClient.get(`/properties/${id}`);
  const data = response.data.data as PropertyDetailed;
  return {
    ...data,
    images: (data.images || []).map((img) => ({
      imageUrl: normalizeImageUrl(img.imageUrl),
    })),
  };
};

/**
 * Fetches all properties listed by the currently authenticated owner.
 */
export const getOwnerProperties = async (): Promise<OwnerProperty[]> => {
  const response = await apiClient.get("/properties/mine/my-properties");
  const items: OwnerProperty[] = response.data.data;
  return items.map((it) => ({
    ...it,
    images: (it.images || []).map((img) => ({
      imageUrl: normalizeImageUrl(img.imageUrl),
    })),
  }));
};
