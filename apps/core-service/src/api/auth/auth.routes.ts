// File Path: apps/core-service/src/api/auth/auth.routes.ts

import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

/**
 * Creates and returns the Express router for the auth module.
 * @param controller The AuthController instance.
 * @returns The configured Express router.
 */
export function createAuthRouter(controller: AuthController): Router {
  const router = Router();

  // Route for user registration
  router.post("/register", controller.register);

  // Route for user login
  router.post("/login", controller.login);

  // Route to get a new access token using a refresh token
  router.post("/refresh", controller.refresh);

  // Route for user logout, requires authentication
  router.post("/logout", authenticate, controller.logout);

  return router;
}
