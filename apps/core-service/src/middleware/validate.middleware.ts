import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

/**
 * A middleware that validates the incoming request against a provided Zod schema.
 * @param schema - The Zod schema to validate against.
 */
export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format the Zod error to be more user-friendly
        const errorMessages = error.errors.map((issue) => ({
          field: issue.path.join(".").replace("body.", ""),
          message: issue.message,
        }));
        // Pass a structured error to the global error handler
        next(new ApiError(400, "Validation failed", errorMessages));
      } else {
        next(
          new ApiError(500, "An unexpected error occurred during validation.")
        );
      }
    }
  };
