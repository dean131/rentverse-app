import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { Prisma } from "@prisma/client";

export const errorHandler = (
  err: ApiError | Error, // Can now be ApiError
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      // Include validation errors if they exist
      errors: (err as any).errors || undefined,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with this identifier already exists.",
      });
    }
  }

  return res.status(500).json({
    success: false,
    message: "An internal server error occurred.",
  });
};
