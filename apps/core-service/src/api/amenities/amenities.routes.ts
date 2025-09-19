// File Path: apps/core-service/src/api/amenities/amenities.routes.ts
import { Router } from "express";
import { AmenityController } from "./amenities.controller.js";

export const createAmenityRouter = (controller: AmenityController): Router => {
  const router = Router();
  router.get("/", controller.getAllAmenities);
  return router;
};
