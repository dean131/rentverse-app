// File Path: apps/core-service/src/api/admin/admin.routes.ts
import { Router } from "express";
import { AdminController } from "./admin.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { updateStatusSchema } from "./admin.validation.js";

export const createAdminRouter = (controller: AdminController): Router => {
  const router = Router();

  // Middleware pipeline: Check for login, then check for ADMIN role.
  router.use(protect, authorize("ADMIN"));

  router.get("/properties/pending", controller.getPendingProperties);

  router.patch(
    "/properties/:id/status",
    validate(updateStatusSchema),
    controller.updatePropertyStatus
  );

  return router;
};
