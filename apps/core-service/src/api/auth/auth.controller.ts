import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

// The controller handles the HTTP request and response layer.
// It is decoupled from the business logic via the service.
export class AuthController {
  private authService: AuthService;

  // The service is "injected" via the constructor.
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  // Use arrow functions to automatically bind `this`
  registerUser = async (req: Request, res: Response) => {
    try {
      const newUser = await this.authService.registerUser(req.body);
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'Email already exists.' });
      }
      res.status(500).json({ message: 'An error occurred during registration.', error: error.message });
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.loginUser(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };
}

