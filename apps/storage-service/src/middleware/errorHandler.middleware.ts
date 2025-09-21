// File Path: apps/core-service/src/middleware/errorHandler.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/response.helper.js";

/**
 * Global error handler middleware for Express.js.
 * Catches errors from routes and other middleware and sends a formatted JSON response.
 * It distinguishes between custom API errors and generic server errors.
 * @param err The error object.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The Express next middleware function.
 */
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(new ApiResponse(err.statusCode, null, err.message));
  }

  // Handle generic errors with a 500 status code
  res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
};

export { errorHandler };
