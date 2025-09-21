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

  // Create a new booking request (for tenants)
  router.post("/", authenticate, controller.createAgreement);

  // Get all agreements for the authenticated user
  router.get("/my-agreements", authenticate, controller.getMyAgreements);

  // Approve a pending agreement (for owners)
  router.patch(
    "/:id/approve",
    authenticate,
    authorize([Role.PROPERTY_OWNER]),
    controller.approveAgreement
  );

  // Reject a pending agreement (for owners)
  router.patch(
    "/:id/reject",
    authenticate,
    authorize([Role.PROPERTY_OWNER]),
    controller.rejectAgreement
  );

  return router;
}
