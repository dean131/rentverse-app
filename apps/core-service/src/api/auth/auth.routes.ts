import { Router } from 'express';
import { AuthController } from './auth.controller.js';

// This function creates and configures the router, injecting the controller.
export const createAuthRouter = (controller: AuthController): Router => {
  const router = Router();

  router.post('/register', controller.registerUser);
  router.post('/login', controller.loginUser);

  return router;
};

