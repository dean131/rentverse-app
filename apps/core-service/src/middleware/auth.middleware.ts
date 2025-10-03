// File Path: apps/core-service/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
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

export const authenticate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Authentication token missing.");
    }

    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
      req.user = { id: decoded.userId, role: decoded.role };
      next();
    } catch (error) {
      throw new ApiError(401, "Invalid or expired authentication token.");
    }
  }
);
