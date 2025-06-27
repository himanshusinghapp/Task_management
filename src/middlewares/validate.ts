import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export class Validate {
  static middleware(schema: Joi.ObjectSchema<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: false,
          message: error.details[0].message,
        });
      }
      req.body = value;
      next();
    };
  }
}