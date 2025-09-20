// File Path: apps/core-service/src/api/agreements/agreements.validation.ts
import { z } from "zod";

export const createAgreementSchema = z.object({
  body: z
    .object({
      propertyId: z
        .number()
        .int()
        .positive("Property ID must be a positive integer"),
      // Zod will validate that these are valid ISO date strings
      startDate: z.string().datetime({ message: "Invalid start date format" }),
      endDate: z.string().datetime({ message: "Invalid end date format" }),
    })
    .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
      message: "End date must be after start date",
      path: ["endDate"], // This helps the frontend show the error on the correct field
    }),
});
