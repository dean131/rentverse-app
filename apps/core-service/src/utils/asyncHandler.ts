import { Request, Response, NextFunction, RequestHandler } from "express";

// Define a type for our async functions to ensure type safety
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * A robust wrapper for async route handlers to simplify error handling.
 * It catches any errors and passes them to the global error handler.
 * @param fn - The async controller function to wrap.
 */
export const asyncHandler =
  (fn: AsyncRequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    // Explicitly resolve the promise and chain the catch
    Promise.resolve(fn(req, res, next)).catch(next);
  };
