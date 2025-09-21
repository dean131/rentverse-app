// File Path: apps/core-service/src/app.ts

// This file has been updated to include the new agreements and webhooks modules.

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

import { ViewRepository } from "./api/views/views.repository.js";
import { ViewService } from "./api/views/views.service.js";
import { ViewController } from "./api/views/views.controller.js";
import { createViewRouter } from "./api/views/views.routes.js";

import { AmenityRepository } from "./api/amenities/amenities.repository.js";
import { AmenityService } from "./api/amenities/amenities.service.js";
import { AmenityController } from "./api/amenities/amenities.controller.js";
import { createAmenityRouter } from "./api/amenities/amenities.routes.js";

import { AgreementRepository } from "./api/agreements/agreements.repository.js";
import { AgreementService } from "./api/agreements/agreements.service.js";
import { AgreementController } from "./api/agreements/agreements.controller.js";
import { createAgreementRouter } from "./api/agreements/agreements.routes.js";

import { WebhookService } from "./api/webhooks/webhooks.service.js";
import { WebhookController } from "./api/webhooks/webhooks.controller.js";
import { createWebhookRouter } from "./api/webhooks/webhooks.routes.js";

import { DocusignService } from "./services/docusign.service.js";

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

// --- Middleware ---
app.use(cors(corsOptions));
app.use(cookieParser());
// NEW: Add a middleware to handle webhook raw body
app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// --- Dependency Injection ---
const propertyRepository = new PropertyRepository();
const userRepository = new UserRepository();
const adminRepository = new AdminRepository();
const agreementRepository = new AgreementRepository();

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const propertyService = new PropertyService(propertyRepository);
const propertyController = new PropertyController(propertyService);

const projectRepository = new ProjectRepository();
const projectService = new ProjectService(projectRepository);
const projectController = new ProjectController(projectService);

const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

const userService = new UserService(
  userRepository,
  propertyRepository,
  adminRepository
);
const userController = new UserController(userService);

const viewRepository = new ViewRepository();
const viewService = new ViewService(viewRepository);
const viewController = new ViewController(viewService);

const amenityRepository = new AmenityRepository();
const amenityService = new AmenityService(amenityRepository);
const amenityController = new AmenityController(amenityService);

// NEW: Instantiate new services and controllers for agreements and webhooks
const docusignService = new DocusignService();
const agreementService = new AgreementService(
  agreementRepository,
  propertyRepository,
  docusignService
);
const agreementController = new AgreementController(agreementService);

const webhookService = new WebhookService(agreementRepository);
const webhookController = new WebhookController(webhookService);

// --- API Routes ---
app.use("/api/auth", createAuthRouter(authController));
app.use("/api/properties", createPropertyRouter(propertyController));
app.use("/api/projects", createProjectRouter(projectController));
app.use("/api/admin", createAdminRouter(adminController));
app.use("/api/users", createUserRouter(userController));
app.use("/api/views", createViewRouter(viewController));
app.use("/api/amenities", createAmenityRouter(amenityController));
// NEW: Add new routes
app.use("/api/agreements", createAgreementRouter(agreementController));
app.use("/api/webhooks", createWebhookRouter(webhookController));

// --- Error Handler ---
app.use(errorHandler);

export default app;
