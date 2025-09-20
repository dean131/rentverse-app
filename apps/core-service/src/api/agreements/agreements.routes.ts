// File Path: apps/core-service/src/api/agreements/agreements.routes.ts
import { Router } from "express";
import { AgreementController } from "./agreements.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createAgreementSchema } from "./agreements.validation.js";

export const createAgreementRouter = (
  controller: AgreementController
): Router => {
  const router = Router();

  // All routes in this module are protected and require a valid login
  router.use(protect);

  // Route for a tenant to create a new booking request
  router.post("/", validate(createAgreementSchema), controller.createAgreement);

  // Route for any logged-in user to fetch their agreements
  router.get("/my-agreements", controller.getMyAgreements);

  router.patch("/:id/approve", controller.approveAgreement);

  return router;
};
