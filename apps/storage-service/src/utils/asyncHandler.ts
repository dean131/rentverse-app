// File Path: apps/core-service/src/utils/asyncHandler.ts
import { Request, Response, NextFunction } from "express";

type AsyncHandlerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * A utility to wrap async Express.js route handlers.
 * It catches any errors and passes them to the next middleware.
 * @param requestHandler The async function to be wrapped.
 * @returns A new function that handles the request and catches errors.
 */
const asyncHandler = (requestHandler: AsyncHandlerFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
