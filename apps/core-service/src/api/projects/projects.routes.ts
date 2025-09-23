// File Path: apps/core-service/src/api/projects/projects.routes.ts
import { Router } from "express";
import { ProjectController } from "./projects.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

export const createProjectRouter = (controller: ProjectController): Router => {
  const router = Router();

  // This route should be protected so only logged-in users (like property owners) can see it
  router.use(protect);

  router.get("/", controller.getAllProjects);

  return router;
};
