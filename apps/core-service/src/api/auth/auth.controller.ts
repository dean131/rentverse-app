// File Path: apps/core-service/src/api/auth/auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // CRUCIAL FIX: Explicitly set the domain to 'localhost'.
      // This tells the browser the cookie is valid for both localhost:3000 and localhost:8080.
      domain: "localhost",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  register = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    ApiResponse.created(res, user);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await this.authService.login(
      req.body
    );
    this.setRefreshTokenCookie(res, refreshToken);
    ApiResponse.success(res, { user, accessToken });
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const { user, accessToken } = await this.authService.refresh(refreshToken);
    ApiResponse.success(res, { user, accessToken });
  });

  logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (userId) {
      await this.authService.logout(userId);
    }
    res.clearCookie("refreshToken", {
      // Also specify domain on clear to ensure it's removed correctly
      domain: "localhost",
    });
    ApiResponse.success(res, { message: "Successfully logged out" });
  });
}
