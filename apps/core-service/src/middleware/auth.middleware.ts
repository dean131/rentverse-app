// File Path: apps/core-service/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export interface JwtPayload {
  userId: number;
  role: string;
}

export type AuthenticatedUser = {
  id: number;
  role: string;
};

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const protect = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(
        401,
        "You are not logged in. Please log in to get access."
      );
    }

    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
      req.user = { id: decoded.userId, role: decoded.role };
      next();
    } catch (error) {
      throw new ApiError(401, "Invalid access token. Please log in again.");
    }
  }
);
