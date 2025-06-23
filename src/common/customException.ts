import { HTTP_STATUS } from './constants/httpStatus';
export const Exceptions = {
  BadRequest: (message: string) => ({ status: HTTP_STATUS.BAD_REQUEST, message }),
  Unauthorized: (message: string) => ({ status: HTTP_STATUS.UNAUTHORIZED, message }),
  Forbidden: (message: string) => ({ status: HTTP_STATUS.FORBIDDEN, message }),
  NotFound: (message: string) => ({ status: HTTP_STATUS.NOT_FOUND, message }),
  TooManyRequests: (message: string) => ({ status: HTTP_STATUS.TOO_MANY_REQUESTS, message }),
  InternalServerError: (message: string) => ({ status: HTTP_STATUS.INTERNAL_SERVER_ERROR, message }),
};