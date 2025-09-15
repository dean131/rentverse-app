import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { ApiError } from "../utils/ApiError.js";

// Extend the Express Request interface to include our custom user payload from the JWT
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const protect = (
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
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, config.JWT_SECRET) as {
        userId: number;
        role: string;
      };
      req.user = decoded;
      next();
    } catch (error) {
      return next(new ApiError(401, "Not authorized, token failed"));
    }
  }

  if (!token) {
    // FIXED: Updated the error message to be more explicit.
    return next(new ApiError(401, "Not authorized, no token provided"));
  }
};
