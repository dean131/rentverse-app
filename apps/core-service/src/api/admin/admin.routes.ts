// File Path: apps/core-service/src/api/admin/admin.routes.ts
import { Router } from "express";
import { AdminController } from "./admin.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { updateStatusSchema } from "./admin.validation.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { Role } from "@prisma/client";

export const createAdminRouter = (controller: AdminController): Router => {
  const router = Router();

  router.use(protect, authorize(Role.ADMIN));

  router.get("/properties/pending", controller.getPendingProperties);

  router.patch(
    "/properties/:id/status",
    validate(updateStatusSchema),
    controller.updatePropertyStatus
  );

  router.get("/dashboard/stats", controller.getDashboardStats);

  return router;
};
