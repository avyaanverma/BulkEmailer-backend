class ErrorHandler extends Error {
  public statusCode: number;
  public errorCode?: string;
  constructor({
    statusCode,
    message,
    errorCode = "TEMP_ERROR_CODE",
  }: {
    statusCode: number;
    message: string;
    errorCode?: string;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
