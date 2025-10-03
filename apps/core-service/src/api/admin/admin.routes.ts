// File Path: apps/core-service/src/api/admin/admin.routes.ts

import { Router } from "express";
import { AdminController } from "./admin.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { updateStatusSchema } from "./admin.validation.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { Role } from "@prisma/client";

export function createAdminRouter(controller: AdminController): Router {
  const router = Router();

  router.use(protect, authorize(Role.ADMIN));

  router.get("/properties/pending", controller.getPendingProperties);

  router.patch(
    "/properties/:id/status",
    authenticate,
    authorize([Role.ADMIN]),
    controller.updatePropertyStatus
  );

  router.get("/dashboard/stats", controller.getDashboardStats);
  router.get("/users", controller.getUsers);

  return router;
}
