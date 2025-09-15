import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cookieParser from "cookie-parser";

export const useCookieParser = cookieParser();

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  registerUser = asyncHandler(async (req: Request, res: Response) => {
    const newUser = await this.authService.registerUser(req.body);
    const { password, ...userWithoutPassword } = newUser;
    ApiResponse.created(res, userWithoutPassword);
  });

  loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await this.authService.loginUser(
      email,
      password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    ApiResponse.success(res, { accessToken });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const { accessToken } =
      await this.authService.refreshAccessToken(refreshToken);
    ApiResponse.success(res, { accessToken });
  });

  logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    await this.authService.logoutUser(refreshToken);

    res.clearCookie("refreshToken", { path: "/" });
    ApiResponse.noContent(res);
  });
}
