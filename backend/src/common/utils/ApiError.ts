export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly errors?: unknown;

  constructor(
    statusCode: number,
    message: string,
    errors?: unknown
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request") {
    return new ApiError(400, message);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message = "Resource Not Found") {
    return new ApiError(404, message);
  }

  static conflict(message = "Conflict") {
    return new ApiError(409, message);
  }


  static tooManyRequests(message = "Too Many Requests") {
    return new ApiError(429, message);
  }

  static internal(message = "Internal Server Error") {
    return new ApiError(500, message);
  }
}