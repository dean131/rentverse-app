import express from 'express';
import cors from 'cors';
import { AuthRepository } from './api/auth/auth.repository.js';
import { AuthService } from './api/auth/auth.service.js';
import { AuthController } from './api/auth/auth.controller.js';
import { createAuthRouter } from './api/auth/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// --- Dependency Injection Setup ---
// 1. Create Repository instance (Data Access Layer)
const authRepository = new AuthRepository();

// 2. Inject Repository into Service (Business Logic Layer)
const authService = new AuthService(authRepository);

// 3. Inject Service into Controller (Presentation Layer)
const authController = new AuthController(authService);

// 4. Inject Controller into Router
const authRouter = createAuthRouter(authController);

// --- Route Registration ---
app.use('/api/auth', authRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Core Service' });
});

app.listen(PORT, () => {
  console.log(`Core Service is running on http://localhost:${PORT}`);
});
