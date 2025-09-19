// File Path: apps/core-service/src/api/auth/auth.routes.ts
import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { protect } from "../../middleware/auth.middleware.js";

export const createAuthRouter = (controller: AuthController): Router => {
  const router = Router();

  router.post("/register", validate(registerSchema), controller.register);
  router.post("/login", validate(loginSchema), controller.login);
  router.post("/refresh", controller.refresh);
  // Logout route is protected to ensure only authenticated users can log out
  router.post("/logout", protect, controller.logout);

  return router;
};
