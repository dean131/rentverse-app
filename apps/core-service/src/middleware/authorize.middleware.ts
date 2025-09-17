// File Path: apps/core-service/src/middleware/authorize.middleware.ts
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { Role } from "@prisma/client";

/**
 * Middleware to authorize users based on their role.
 * Throws a 403 Forbidden error if the user role does not match.
 * @param requiredRole - The role required to access the route.
 */
export const authorize = (requiredRole: Role) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || userRole !== requiredRole) {
      return next(
        new ApiError(
          403,
          "Forbidden: You do not have permission to access this resource."
        )
      );
    }

    next();
  };
};
