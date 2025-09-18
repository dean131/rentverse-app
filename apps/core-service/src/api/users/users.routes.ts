// File Path: apps/core-service/src/api/users/users.routes.ts
import { Router } from "express";
import { UserController } from "./users.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

export const createUserRouter = (controller: UserController): Router => {
  const router = Router();

  // All routes in this module are protected and require a valid access token.
  router.use(protect);

  // Route to get dashboard-specific data for the currently logged-in user.
  router.get("/me/dashboard", controller.getUserDashboard);

  return router;
};
