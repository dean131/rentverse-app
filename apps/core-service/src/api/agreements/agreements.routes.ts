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
  router.use(protect);

  router.post("/", validate(createAgreementSchema), controller.createAgreement);
  router.get("/my-agreements", controller.getMyAgreements);
  router.patch("/:id/approve", controller.approveAgreement);
  router.get("/:id/signing-url", controller.getSigningUrl);
  router.get("/:id/download", controller.downloadAgreementDocument);

  return router;
};
