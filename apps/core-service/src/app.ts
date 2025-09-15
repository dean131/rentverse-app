import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
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

const app = express();

// --- Core Middlewares ---
app.use(cors());
app.use(express.json());
app.use(useCookieParser);

// --- Dependency Injection Setup ---
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

// --- Route Registration ---
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/properties", propertyRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Core Service" });
});

// --- Global Error Handler ---
app.use(errorHandler);

// --- Export the configured app ---
export default app;
