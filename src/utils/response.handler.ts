import type { Response } from "express";

// Define a type for validation errors
interface ValidationError {
  field?: string;
  message: string;
  [key: string]: unknown;
}

class ResponseHandler<T = unknown> {
  private statusCode: number;
  private message: string;
  private success: boolean;
  private data: T | null = null;

  constructor(
    statusCode: number,
    message: string,
    success = false,
    data: T | null = null,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
  }

  static tooManyRequests(message: string) {
    return new ResponseHandler(429, message, false);
  }

  static success<T>(data: T, message = "Success"): ResponseHandler<T> {
    return new ResponseHandler<T>(200, message, true, data);
  }
  static created<T>(data: T, message = "Created"): ResponseHandler<T> {
    return new ResponseHandler<T>(201, message, true, data);
  }

  static validationError(
    errors: ValidationError | ValidationError[],
  ): ResponseHandler<ValidationError | ValidationError[]> {
    return new ResponseHandler<ValidationError | ValidationError[]>(
      400,
      "Validation Error",
      false,
      errors,
    );
  }

  static unauthorized(message = "Unauthorized"): ResponseHandler<null> {
    return new ResponseHandler<null>(401, message, false, null);
  }

  static badRequest(message = "badRequest"): ResponseHandler<null> {
    return new ResponseHandler<null>(400, message, false, null);
  }

  static notFound(message = "NotFound"): ResponseHandler<null> {
    return new ResponseHandler<null>(404, message, false, null);
  }

  public send(res: Response): Response {
    return res.status(this.statusCode).json(this);
  }
}

export default ResponseHandler;
