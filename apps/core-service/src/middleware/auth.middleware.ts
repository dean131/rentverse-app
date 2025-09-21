// File Path: apps/core-service/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Role } from "@prisma/client";

// Extending the Express Request interface to include user information
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: Role;
  };
}

interface AuthTokenPayload {
  id: number;
  role: Role;
}

export const authenticate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Authentication token missing.");
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as AuthTokenPayload;
      req.user = decoded; // Attach user payload to the request object
      next();
    } catch (error) {
      throw new ApiError(401, "Invalid or expired authentication token.");
    }
  }
);
