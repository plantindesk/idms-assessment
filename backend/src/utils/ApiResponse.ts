
class ApiResponse<T = any> {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: T;
  public readonly success: boolean;

  constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
