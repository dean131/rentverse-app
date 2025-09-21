import { Router } from "express";
import { ProjectController } from "./projects.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js"; // Import the middleware

export const createProjectRouter = (controller: ProjectController): Router => {
  const router = Router();

  // Protect this route with the auth middleware
  router.get("/", authenticate, controller.getAllProjects);

  return router;
};
