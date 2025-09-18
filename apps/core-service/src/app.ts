// File Path: apps/core-service/src/app.ts
import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { ApiResponse } from "./utils/response.helper.js";

// Import all module components
import { AuthRepository } from "./api/auth/auth.repository.js";
import { AuthService } from "./api/auth/auth.service.js";
import { AuthController, useCookieParser } from "./api/auth/auth.controller.js";
import { createAuthRouter } from "./api/auth/auth.routes.js";

import { ProjectRepository } from "./api/projects/projects.repository.js";
import { ProjectService } from "./api/projects/projects.service.js";
import { ProjectController } from "./api/projects/projects.controller.js";
import { createProjectRouter } from "./api/projects/projects.routes.js";

import { PropertyRepository } from "./api/properties/properties.repository.js";
import { PropertyService } from "./api/properties/properties.service.js";
import { PropertyController } from "./api/properties/properties.controller.js";
import { createPropertyRouter } from "./api/properties/properties.routes.js";

import { AdminRepository } from "./api/admin/admin.repository.js";
import { AdminService } from "./api/admin/admin.service.js";
import { AdminController } from "./api/admin/admin.controller.js";
import { createAdminRouter } from "./api/admin/admin.routes.js";

import { UserRepository } from "./api/users/users.repository.js";
import { UserService } from "./api/users/users.service.js";
import { UserController } from "./api/users/users.controller.js";
import { createUserRouter } from "./api/users/users.routes.js";

const app = express();

// --- Core Middlewares ---
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(useCookieParser);

// --- Dependency Injection Setup (Composition Root) ---
// Auth Module
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
const authRouter = createAuthRouter(authController);

// Project Module
const projectRepository = new ProjectRepository();
const projectService = new ProjectService(projectRepository);
const projectController = new ProjectController(projectService);
const projectRouter = createProjectRouter(projectController);

// Property Module
const propertyRepository = new PropertyRepository();
const propertyService = new PropertyService(propertyRepository);
const propertyController = new PropertyController(propertyService);
const propertyRouter = createPropertyRouter(propertyController);

// Admin Module
const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);
const adminRouter = createAdminRouter(adminController);

// User Module (Handles user-specific data like dashboards)
const userRepository = new UserRepository();
const userService = new UserService(userRepository, adminRepository);
const userController = new UserController(userService);
const userRouter = createUserRouter(userController);

// --- Route Registration ---
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter); // Register the new user routes

app.get("/api/health", (req, res) => {
  ApiResponse.success(res, { status: "ok", service: "Core Service" });
});

// --- Global Error Handler ---
app.use(errorHandler);

// --- Export the configured app ---
export default app;
