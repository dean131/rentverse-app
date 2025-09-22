// File Path: apps/core-service/src/api/properties/properties.routes.ts
import { Router } from "express";
import { PropertyController } from "./properties.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createPropertySchema } from "./properties.validation.js";

export const createPropertyRouter = (
  controller: PropertyController
): Router => {
  const router = Router();

  // Public route to get all approved properties (with optional search)
  router.get("/", controller.getPublicProperties);

  // NEW: Public route to get a single property by its ID.
  // This must come AFTER the root '/' route to avoid conflicts.
  router.get("/:id", controller.getPropertyById);

  // Protected route for property owners to create a new listing
  router.post(
    "/",
    authenticate,
    validate(createPropertySchema),
    controller.createProperty
  );

  router.get("/mine/my-properties", protect, controller.getOwnerProperties);

  return router;
};
