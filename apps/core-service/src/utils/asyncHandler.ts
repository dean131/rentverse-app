import { Request, Response, NextFunction } from "express";

// A wrapper for async route handlers to catch errors and pass them to the global error handler.
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
