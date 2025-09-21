// File Path: apps/core-service/src/api/admin/admin.validation.ts

import { z } from "zod";
import { PropertyStatus } from "@prisma/client";

// Validation schema for updating a property's status to APPROVED or REJECTED.
export const updatePropertyStatusValidation = z.object({
  status: z.enum([PropertyStatus.APPROVED, PropertyStatus.REJECTED], {
    required_error: "Status is required",
    invalid_type_error: "Status must be 'APPROVED' or 'REJECTED'",
  }),
});
