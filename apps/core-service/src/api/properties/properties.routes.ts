import { Router } from "express";
import { PropertyController } from "./properties.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createPropertySchema } from "./properties.validation.js";

export const createPropertyRouter = (
  controller: PropertyController
): Router => {
  const router = Router();

  // Protect this route and validate the input
  router.post(
    "/",
    protect,
    validate(createPropertySchema),
    controller.createProperty
  );

  return router;
};
