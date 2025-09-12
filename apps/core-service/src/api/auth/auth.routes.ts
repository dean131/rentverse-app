import { Router } from "express";
import { AuthController } from "./auth.controller.js";

export const createAuthRouter = (controller: AuthController): Router => {
  const router = Router();

  router.post("/register", controller.registerUser);
  router.post("/login", controller.loginUser);
  router.post("/refresh", controller.refreshToken);
  router.post("/logout", controller.logoutUser);

  return router;
};
