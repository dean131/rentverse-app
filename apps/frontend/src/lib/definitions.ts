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
    path: ["confirmPassword"], // path of error
  });
export type RegisterCredentials = z.infer<typeof registerSchema>;

// --- Property Schemas ---

export const propertySubmissionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  listingType: z.enum(["RENT", "SALE", "BOTH"]),
  propertyType: z.enum([
    "APARTMENT",
    "HOUSE",
    "PENTHOUSE",
    "STUDIO",
    "COMMERCIAL",
  ]),
  rentalPrice: z.coerce.number().positive().optional(),
  paymentPeriod: z.enum(["MONTHLY", "QUARTERLY", "BI_ANNUALLY", "YEARLY"]),
  sizeSqft: z.coerce.number().int().positive("Size must be a positive number"),
  bedrooms: z.coerce.number().int().min(0, "Cannot be negative"),
  bathrooms: z.coerce.number().int().min(0, "Cannot be negative"),
  furnishingStatus: z.enum([
    "UNFURNISHED",
    "PARTIALLY_FURNISHED",
    "FULLY_FURNISHED",
  ]),
  projectId: z.coerce.number().int().optional(),
  viewIds: z.array(z.number()).optional(),
});

export type PropertySubmission = z.infer<typeof propertySubmissionSchema>;

// --- API Data Types ---

export type User = {
  userId: number;
  role: string;
  email: string;
};

export type Project = {
  id: number;
  projectName: string;
};

export type View = {
  id: number;
  name: string;
};

export type PropertyWithLister = {
  id: number;
  title: string;
  status: string;
  propertyType: string;
  listedById: number;
  listedBy: {
    fullName: string;
    email: string;
  };
};
