import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ResponseHelper } from '@common/helpers';
import { HTTP_STATUS } from '@/common/constants';

export class Validate {
  /**
   * @description Validate Body of Incoming Request
   */
  static body(schema: Joi.ObjectSchema<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body);
      if (error) {
        const err = ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error?.message || error?.details?.[0]?.message);
        return res.status(err.statusCode).send(err);
      }
      next();
    };
  }

  /**
   * @description Validate Params of Incoming Request
   */
  static params(schema: Joi.ObjectSchema<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.params);
      if (error) {
        const err = ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error?.message || error?.details?.[0]?.message);
        return res.status(err.statusCode).send(err);
      }
      next();
    };
  }

  /**
   * @description Validate Query of Incoming Request
   */
  static query(schema: Joi.ObjectSchema<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.query);
      if (error) {
        const err = ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error?.message || error?.details?.[0]?.message);
        return res.status(err.statusCode).send(err);
      }
      next();
    };
  }

  /**
   * @description Validate Headers of Incoming Request
   */
  static headers(schema: Joi.ObjectSchema<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.headers);
      if (error) {
        const err = ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error?.message || error?.details?.[0]?.message);
        return res.status(err.statusCode).send(err);
      }
      next();
    };
  }

  /**
   * @description Validate Cookies of Incoming Request
   */
  static cookies(schema: Joi.ObjectSchema<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.cookies);
      if (error) {
        const err = ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error?.message || error?.details?.[0]?.message);
        return res.status(err.statusCode).send(err);
      }
      next();
    };
  }
}