import { z } from "zod";

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(5),
    description: z.string().optional(),
    listingType: z.enum(["SALE", "RENT", "BOTH"]),
    propertyType: z.enum([
      "APARTMENT",
      "HOUSE",
      "PENTHOUSE",
      "STUDIO",
      "COMMERCIAL",
    ]),
    rentalPrice: z.number().positive().optional().nullable(),
    paymentPeriod: z
      .enum(["MONTHLY", "QUARTERLY", "BI_ANNUALLY", "YEARLY"])
      .optional()
      .nullable(),
    salePrice: z.number().positive().optional().nullable(),
    maintenanceFee: z.number().positive().optional().nullable(),
    sizeSqft: z.number().int().positive(),
    bedrooms: z.number().int().min(0),
    bathrooms: z.number().int().min(0),
    furnishingStatus: z.enum([
      "UNFURNISHED",
      "PARTIALLY_FURNISHED",
      "FULLY_FURNISHED",
    ]),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    projectId: z.number().int().optional().nullable(),
    ownershipDocumentUrl: z.string().url(),
    viewIds: z.array(z.number().int()).optional(),
  }),
});
