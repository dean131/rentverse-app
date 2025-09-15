import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error for debugging purposes (you can integrate a real logger here later)
  console.error(`Error: ${err.message}`, { stack: err.stack });

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle Prisma-specific errors
  if (err.name === "PrismaClientKnownRequestError") {
    // Example: Unique constraint violation
    if ((err as any).code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with this identifier already exists.",
      });
    }
  }

  // For any other unexpected error, send a generic 500 response
  return res.status(500).json({
    success: false,
    message: "An internal server error occurred.",
  });
};
