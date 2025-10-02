// File Path: apps/frontend/src/lib/definitions.ts
import { z } from "zod";

// --- Auth Schemas ---

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginCredentials = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["TENANT", "PROPERTY_OWNER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type RegisterCredentials = z.infer<typeof registerSchema>;

export const propertySubmissionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  listingType: z.enum(["RENT", "SALE", "BOTH"], {
    required_error: "Please select a listing type.",
  }),
  propertyType: z.enum(
    ["APARTMENT", "HOUSE", "PENTHOUSE", "STUDIO", "COMMERCIAL"],
    { required_error: "Please select a property type." }
  ),
  rentalPrice: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive()
    .optional()
    .nullable(),
  paymentPeriod: z
    .enum(["MONTHLY", "QUARTERLY", "BI_ANNUALLY", "YEARLY"])
    .optional()
    .nullable(),
  sizeSqft: z.coerce
    .number({ required_error: "Area is required" })
    .int()
    .positive("Size must be a positive number"),
  bedrooms: z.coerce
    .number({ required_error: "Bedrooms count is required" })
    .int()
    .min(0, "Cannot be negative"),
  bathrooms: z.coerce
    .number({ required_error: "Bathrooms count is required" })
    .int()
    .min(0, "Cannot be negative"),
  furnishingStatus: z.enum(
    ["UNFURNISHED", "PARTIALLY_FURNISHED", "FULLY_FURNISHED"],
    { required_error: "Please select the furnishing status." }
  ),
  projectId: z.coerce.number().int().optional().nullable(),
  address: z.string().min(10, "Please enter a full address.").optional(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  viewIds: z.array(z.coerce.number()).optional(),
  amenityIds: z.array(z.coerce.number()).optional(),
  ownershipDocumentUrl: z
    .string()
    .url("A valid document URL or uploaded file is required.")
    .min(1, "A document URL or uploaded file is required."),
  images: z
    .array(z.string().url("Each image must be a valid URL."))
    .min(1, "At least one image is required."),
});

export type PropertySubmission = z.infer<typeof propertySubmissionSchema>;

// --- API Data Types ---

export type User = {
  userId: number;
  email: string;
  role: string;
};

export type Project = {
  id: number;
  projectName: string;
};

export type Amenity = {
  id: number;
  name: string;
};

export type View = {
  id: number;
  name: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  totalPages: number;
  currentPage: number;
};

// For the admin list of pending properties
export type PropertyWithLister = {
  id: number;
  title: string;
  propertyType: string;
  rentalPrice: number | null;
  listedBy: {
    fullName: string;
    email: string;
  };
  images?: { imageUrl: string }[];
};

// For the public property cards on the homepage and search results
export type PropertyPublic = {
  id: number;
  title: string;
  listingType: "RENT" | "SALE" | "BOTH";
  rentalPrice: number | null;
  paymentPeriod: string | null;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  address: string | null;
  images: { imageUrl: string }[];
};

// This type represents the raw data structure from the public properties API
export type RawPropertyFromAPI = Omit<PropertyPublic, "address"> & {
  address?: string | null; // The property might have its own address
  project: { address: string } | null;
};

// For the detailed property view page
export type PropertyDetailed = {
  id: number;
  title: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SOLD" | "RENTED";
  address: string;
  rentalPrice: number | null;
  paymentPeriod: string | null;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  furnishingStatus: string;
  latitude: number | null;
  longitude: number | null;
  images: { imageUrl: string }[];
  amenities: Amenity[];
  views: View[];
  documents: { fileUrl: string; documentType: string }[]; // <-- Add this line
  listedBy: {
    fullName: string;
    email: string;
    profilePictureUrl: string | null;
  };
};

export type StatusUpdatePayload = {
  status: "APPROVED" | "REJECTED";
};

export type PropertyFilters = {
  search?: string;
  listingType?: string;
  propertyType?: string;
  beds?: string;
  page?: number;
};

export type OwnerDashboardStats = {
  totalListings: number;
  pending: number;
  approved: number;
  rejected: number;
};

export type PredictionFeatures = {
  area_sqft: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  listing_type: string;
  property_type: string;
};

export type BookingRequest = {
  propertyId: number;
  startDate: string;
  endDate: string;
};

export type TenancyAgreement = {
  id: number;
  status: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  propertyId: number;
  ownerId: number;
  tenantId: number;
};

export type AgreementDetails = {
  id: number;
  status: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  property: {
    id: number;
    title: string;
    images: { imageUrl: string }[];
  };
  tenant: { id: number; fullName: string };
  owner: { id: number; fullName: string };
};

export type OwnerProperty = {
  id: number;
  title: string;
  propertyType: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  images: { imageUrl: string }[];
};

export interface AdminDashboardStats {
  totalDocuments: number;
  registeredUsers: number;
  pendingProperties: number;
  documentsThisMonth: number;
}
