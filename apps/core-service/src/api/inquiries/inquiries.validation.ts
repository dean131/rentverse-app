import { z } from "zod";

export const createInquirySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.string().email("A valid email is required"),
    message: z.string().min(1, "Message is required"),
    propertyId: z.number().int().positive(),
  }),
});
