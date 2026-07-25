export class ApiResponse<T> {
  constructor(
    public statusCode: number,
    public success: boolean,
    public message: string,
    public data?: T,
    public meta?: object
  ) {}

  static success<T>(
    data: T,
    message = "Success",
    statusCode = 200,
    meta?: object
  ) {
    return new ApiResponse(statusCode, true, message, data, meta);
  }

  static created<T>(
    data: T,
    message = "Created Successfully"
  ) {
    return new ApiResponse(201, true, message, data);
  }

  static noContent() {
    return new ApiResponse(204, true, "No Content");
  }
}