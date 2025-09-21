// File Path: apps/core-service/src/api/agreements/agreements.validation.ts

import { z } from "zod";

// Validation schema for creating a new agreement
export const createAgreementValidation = z.object({
  propertyId: z.number({ invalid_type_error: "propertyId must be an integer" }),
  startDate: z
    .string()
    .datetime({ message: "startDate must be a valid ISO 8601 date string" }),
  endDate: z
    .string()
    .datetime({ message: "endDate must be a valid ISO 8601 date string" }),
});

// Validation schema for updating agreement status (for admin/owner actions)
export const updateAgreementStatusValidation = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be either 'APPROVED' or 'REJECTED'",
  }),
});
