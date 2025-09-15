import { Response } from "express";

// A standardized class for sending API responses.
export class ApiResponse {
  static success<T>(res: Response, data: T, statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      data,
    });
  }

  static created<T>(res: Response, data: T): void {
    this.success(res, data, 201);
  }

  static noContent(res: Response): void {
    res.status(204).send();
  }
}
