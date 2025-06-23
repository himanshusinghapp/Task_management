export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
}

export class ResponseHelper {
  static success<T>(message: string, data?: T): ApiResponse<T> {
    return {
      statusCode: 200,
      message,
      data,
    };
  }

  static created<T>(message: string, data?: T): ApiResponse<T> {
    return {
      statusCode: 201,
      message,
      data,
    };
  }

  static error<T>(statusCode: number, message: string, data?: T): ApiResponse<T> {
    return {
      statusCode,
      message,
      data,
    };
  }
}