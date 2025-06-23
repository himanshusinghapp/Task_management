import Joi from 'joi';
import { Types } from 'mongoose';
const objectId = (value: string, helpers: any) => {
    if (!Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid', { message: 'Must be a valid ObjectId' });
    }
    return value;
  };
  
  export  const searchQueryDto = Joi.object({
    query: Joi.string().trim().min(1).max(100).required(),
  });