// File Path: apps/core-service/src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

// Import modules
import { AuthRepository } from "./api/auth/auth.repository.js";
import { AuthService } from "./api/auth/auth.service.js";
import { AuthController } from "./api/auth/auth.controller.js";
import { createAuthRouter } from "./api/auth/auth.routes.js";

import { PropertyRepository } from "./api/properties/properties.repository.js";
import { PropertyService } from "./api/properties/properties.service.js";
import { PropertyController } from "./api/properties/properties.controller.js";
import { createPropertyRouter } from "./api/properties/properties.routes.js";

import { ProjectRepository } from "./api/projects/projects.repository.js";
import { ProjectService } from "./api/projects/projects.service.js";
import { ProjectController } from "./api/projects/projects.controller.js";
import { createProjectRouter } from "./api/projects/projects.routes.js";

import { AdminRepository } from "./api/admin/admin.repository.js";
import { AdminService } from "./api/admin/admin.service.js";
import { AdminController } from "./api/admin/admin.controller.js";
import { createAdminRouter } from "./api/admin/admin.routes.js";

import { UserRepository } from "./api/users/users.repository.js";
import { UserService } from "./api/users/users.service.js";
import { UserController } from "./api/users/users.controller.js";
import { createUserRouter } from "./api/users/users.routes.js";

// NEW: Import the new views and amenities modules
import { ViewRepository } from "./api/views/views.repository.js";
import { ViewService } from "./api/views/views.service.js";
import { ViewController } from "./api/views/views.controller.js";
import { createViewRouter } from "./api/views/views.routes.js";

import { AmenityRepository } from "./api/amenities/amenities.repository.js";
import { AmenityService } from "./api/amenities/amenities.service.js";
import { AmenityController } from "./api/amenities/amenities.controller.js";
import { createAmenityRouter } from "./api/amenities/amenities.routes.js";

const app = express();

// --- CORS Configuration ---
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("This origin is not allowed by CORS"));
    }
  },
  credentials: true,
};

// Use the configured CORS options.
app.use(cors(corsOptions));

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Dependency Injection ---
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const propertyRepository = new PropertyRepository();
const propertyService = new PropertyService(propertyRepository);
const propertyController = new PropertyController(propertyService);

const projectRepository = new ProjectRepository();
const projectService = new ProjectService(projectRepository);
const projectController = new ProjectController(projectService);

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

const userRepository = new UserRepository();
const userService = new UserService(
  userRepository,
  propertyRepository,
  adminRepository
);
const userController = new UserController(userService);

// NEW: Instantiate the new views and amenities modules
const viewRepository = new ViewRepository();
const viewService = new ViewService(viewRepository);
const viewController = new ViewController(viewService);

const amenityRepository = new AmenityRepository();
const amenityService = new AmenityService(amenityRepository);
const amenityController = new AmenityController(amenityService);

// --- API Routes ---
app.use("/api/auth", createAuthRouter(authController));
app.use("/api/properties", createPropertyRouter(propertyController));
app.use("/api/projects", createProjectRouter(projectController));
app.use("/api/admin", createAdminRouter(adminController));
app.use("/api/users", createUserRouter(userController));
// NEW: Register the new routes
app.use("/api/views", createViewRouter(viewController));
app.use("/api/amenities", createAmenityRouter(amenityController));

// --- Error Handler ---
app.use(errorHandler);

export default app;
