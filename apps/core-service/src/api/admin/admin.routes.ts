// File Path: apps/core-service/src/api/admin/admin.routes.ts

import { Router } from "express";
import { AdminController } from "./admin.controller.js";
// Corrected middleware name from 'protect' to 'authenticate'
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { Role } from "@prisma/client";

export function createAdminRouter(controller: AdminController): Router {
  const router = Router();

  // Get all pending properties (admin only)
  // Corrected the argument for the authorize middleware to be an array of Role enums
  router.get(
    "/properties/pending",
    authenticate,
    authorize([Role.ADMIN]),
    controller.getPendingProperties
  );

  // Update a property's status (admin only)
  // Corrected the argument for the authorize middleware to be an array of Role enums
  router.patch(
    "/properties/:id/status",
    authenticate,
    authorize([Role.ADMIN]),
    controller.updatePropertyStatus
  );

  return router;
}
