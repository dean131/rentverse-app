// File Path: apps/frontend/src/lib/definitions.ts
import { z } from "zod";

// --- User & Auth Schemas ---

// Interface for the user object decoded from the JWT
export interface User {
  userId: number;
  role: string;
}

// Zod schema for the login form
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// TypeScript type inferred from the login schema
export type LoginCredentials = z.infer<typeof loginSchema>;

// Zod schema for the registration form
export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
    role: z.enum(["PROPERTY_OWNER", "TENANT"], {
      errorMap: () => ({ message: "You must select a role" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Set error on the confirmPassword field
  });

// TypeScript type inferred from the register schema
export type RegisterCredentials = z.infer<typeof registerSchema>;

// --- Property Schemas ---

// Zod schema for the property submission form
export const propertySubmissionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z.string().optional(),
  listingType: z.enum(["RENT", "SALE", "BOTH"]),
  propertyType: z.enum([
    "APARTMENT",
    "HOUSE",
    "PENTHOUSE",
    "STUDIO",
    "COMMERCIAL",
  ]),
  // Use coerce.number() to handle string inputs from the form
  rentalPrice: z.coerce
    .number()
    .positive("Price must be a positive number")
    .optional()
    .nullable(),
  paymentPeriod: z
    .enum(["MONTHLY", "QUARTERLY", "BI_ANNUALLY", "YEARLY"])
    .optional()
    .nullable(),
  salePrice: z.coerce
    .number()
    .positive("Price must be a positive number")
    .optional()
    .nullable(),
  maintenanceFee: z.coerce
    .number()
    .positive("Fee must be a positive number")
    .optional()
    .nullable(),
  sizeSqft: z.coerce.number().int().positive("Size must be a positive number"),
  bedrooms: z.coerce.number().int().min(0, "Cannot be negative"),
  bathrooms: z.coerce.number().int().min(0, "Cannot be negative"),
  furnishingStatus: z.enum([
    "UNFURNISHED",
    "PARTIALLY_FURNISHED",
    "FULLY_FURNISHED",
  ]),
  latitude: z.coerce
    .number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude"),
  longitude: z.coerce
    .number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude"),
  projectId: z.coerce.number().int().optional().nullable(),
  ownershipDocumentUrl: z.string().url("A valid document URL is required"),
  viewIds: z.array(z.number().int()).optional(),
});

// TypeScript type inferred from the property submission schema
export type PropertySubmission = z.infer<typeof propertySubmissionSchema>;
