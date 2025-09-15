import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { registerUserSchema, loginUserSchema } from "./auth.validation.js";

export const createAuthRouter = (controller: AuthController): Router => {
  const router = Router();

  // The validation middleware runs before the controller function
  router.post(
    "/register",
    validate(registerUserSchema),
    controller.registerUser
  );
  router.post("/login", validate(loginUserSchema), controller.loginUser);

  router.post("/refresh", controller.refreshToken);
  router.post("/logout", controller.logoutUser);

  return router;
};
