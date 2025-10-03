// File Path: apps/core-service/src/api/agreements/agreements.routes.ts

import { Router } from "express";
import { AgreementController } from "./agreements.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { Role } from "@prisma/client";

/**
 * Creates and returns the Express router for the agreements module.
 * @param controller The AgreementController instance.
 * @returns The configured Express router.
 */
export function createAgreementRouter(controller: AgreementController): Router {
  const router = Router();
  router.use(protect);

  router.post("/", validate(createAgreementSchema), controller.createAgreement);
  router.get("/my-agreements", controller.getMyAgreements);
  router.patch("/:id/approve", controller.approveAgreement);
  router.get("/:id/signing-url", controller.getSigningUrl);
  router.get("/:id/download", controller.downloadAgreementDocument);

  return router;
}
