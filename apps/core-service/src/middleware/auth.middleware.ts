// File Path: apps/core-service/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Define a specific type for the data we expect to be in the JWT payload.
export interface JwtPayload {
  userId: number;
  role: string;
}

// Define the specific shape of the 'user' object that we will attach to authenticated requests.
// This is the lightweight object our services will now expect.
export type AuthenticatedUser = {
  id: number;
  role: string;
};

// Extend the Express Request interface to include our custom 'user' property.
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const protect = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. Get the token from cookies or the Authorization header.
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
      // 2. Verify the token using the secret key.
      const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;

      // 3. Attach a user object with the correct shape (id and role) to the request.
      // This is the crucial part that fixes the type mismatch errors in other services.
      req.user = { id: decoded.userId, role: decoded.role };

      // 4. Proceed to the next middleware or route handler.
      next();
    } catch (error) {
      throw new ApiError(401, "Invalid access token. Please log in again.");
    }
  }
);
