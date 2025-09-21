// File Path: apps/core-service/src/api/users/users.validation.ts

import { z } from "zod";

/**
 * Zod validation schema for updating a user's profile.
 * All fields are optional, as a user may only want to update a single piece of information.
 */
export const updateUserProfileValidation = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
});
