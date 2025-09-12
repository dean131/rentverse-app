import express from "express";
import cors from "cors";
import { AuthRepository } from "./api/auth/auth.repository.js";
import { AuthService } from "./api/auth/auth.service.js";
import { AuthController, useCookieParser } from "./api/auth/auth.controller.js";
import { createAuthRouter } from "./api/auth/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(useCookieParser); // Add cookie parser middleware

// --- Dependency Injection Setup ---
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
const authRouter = createAuthRouter(authController);

// --- Route Registration ---
app.use("/api/auth", authRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Core Service" });
});

app.listen(PORT, () => {
  console.log(`Core Service is running on http://localhost:${PORT}`);
});
