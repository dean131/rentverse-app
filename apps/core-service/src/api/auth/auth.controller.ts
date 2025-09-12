import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import cookieParser from "cookie-parser"; // We will need to install this dependency

// Use cookie parser middleware to read cookies
export const useCookieParser = cookieParser();

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  registerUser = async (req: Request, res: Response) => {
    try {
      const newUser = await this.authService.registerUser(req.body);
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(409).json({ message: "Email already exists." });
      }
      res
        .status(500)
        .json({
          message: "An error occurred during registration.",
          error: error.message,
        });
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await this.authService.loginUser(
        email,
        password
      );

      // Send the refresh token in a secure, HttpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      res.status(200).json({ accessToken });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.cookies;
      const { accessToken } =
        await this.authService.refreshAccessToken(refreshToken);
      res.status(200).json({ accessToken });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };

  logoutUser = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.cookies;
      await this.authService.logoutUser(refreshToken);

      // Clear the cookie on the client side
      res.clearCookie("refreshToken", { path: "/" });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "An error occurred during logout." });
    }
  };
}
