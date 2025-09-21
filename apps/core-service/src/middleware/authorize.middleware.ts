// File Path: apps/core-service/src/middleware/authorize.middleware.ts

import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { Role } from "@prisma/client";

// This middleware checks if the authenticated user has one of the allowed roles.
export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userRole: Role = req.user.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action."
      );
    }
    next();
  };
};
