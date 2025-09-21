// File Path: apps/core-service/src/api/users/users.routes.ts

import { Router } from "express";
import { UserController } from "./users.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

/**
 * Creates and returns the Express router for the users module.
 * @param controller The UserController instance.
 * @returns The configured Express router.
 */
export function createUserRouter(controller: UserController): Router {
  const router = Router();

  // Route to get the currently authenticated user's profile
  router.get("/me", authenticate, controller.getMe);

  // Route to update the currently authenticated user's profile
  router.patch("/me", authenticate, controller.updateProfile);

  return router;
}
