import { AppError } from './customError';
import { HTTP_STATUS } from '../constants/httpStatus';

export const Exceptions = {
  BadRequest: (message: string) => new AppError(HTTP_STATUS.BAD_REQUEST, message),
  Unauthorized: (message: string) => new AppError(HTTP_STATUS.UNAUTHORIZED, message),
  Forbidden: (message: string) => new AppError(HTTP_STATUS.FORBIDDEN, message),
  NotFound: (message: string) => new AppError(HTTP_STATUS.NOT_FOUND, message),
  TooManyRequests: (message: string) => new AppError(HTTP_STATUS.TOO_MANY_REQUESTS, message),
  InternalServerError: (message: string) => new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
};
