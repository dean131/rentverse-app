// File Path: apps/core-service/src/api/uploads/uploads.routes.ts
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { UploadController } from "./uploads.controller.js";

export const createUploadRouter = (controller: UploadController): Router => {
  const router = Router();
  router.use(protect); // Ensure only logged-in users can get upload URLs

  router.post("/presigned-url", controller.getPresignedUrl);

  return router;
};
