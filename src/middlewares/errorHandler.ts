import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import { ResponseHelper } from '@common/helpers/response.helper';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Something went wrong';
  res.status(status).json(ResponseHelper.error(status, message));
} 