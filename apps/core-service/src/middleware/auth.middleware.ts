import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../lib/prisma.js";

// Extend the Express Request interface to include the user payload from the JWT
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET) as {
        userId: number;
        role: string;
      };

      // Attach user to the request object
      req.user = decoded;

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return next(new ApiError(401, "Not authorized, token failed"));
    }
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized, no token"));
  }
};
