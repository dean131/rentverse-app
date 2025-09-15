/**
 * Custom error class to create operational, catchable errors with specific HTTP status codes.
 * It can also carry a payload of structured validation errors.
 */
export class ApiError extends Error {
  public statusCode: number;
  public errors?: any[]; // Optional property to hold structured validation errors

  /**
   * Creates an instance of ApiError.
   * @param statusCode - The HTTP status code for the error (e.g., 400, 401, 404).
   * @param message - A clear, user-friendly error message.
   * @param errors - An optional array of detailed validation errors.
   */
  constructor(statusCode: number, message: string, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
