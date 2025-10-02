// Create a new file at: core-service/src/api/inquiries/inquiries.routes.ts

import { Router } from "express";
import { InquiryController } from "./inquiries.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createInquirySchema } from "./inquiries.validation.js";

export const createInquiryRouter = (controller: InquiryController): Router => {
  const router = Router();

  // This is a public endpoint
  router.post("/", validate(createInquirySchema), controller.submitInquiry);

  return router;
};
