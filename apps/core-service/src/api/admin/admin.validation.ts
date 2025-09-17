// File Path: apps/core-service/src/api/admin/admin.validation.ts
import { z } from "zod";

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["APPROVED", "REJECTED"], {
      errorMap: () => ({
        message: "Status must be either APPROVED or REJECTED",
      }),
    }),
  }),
  params: z.object({
    id: z.string().refine((val) => !isNaN(parseInt(val, 10)), {
      message: "ID must be a number",
    }),
  }),
});
