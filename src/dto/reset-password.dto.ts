import Joi from 'joi';
import { Types } from 'mongoose';

const objectId = (value: string, helpers: any) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', { message: 'Must be a valid ObjectId' });
  }
  return value;
};

export const resetPasswordSchema = Joi.object({
  userId: Joi.string().custom(objectId).required(),
  otp: Joi.string().trim().length(6).required(),
  newPassword: Joi.string()
    .min(8)
    .max(100)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
    .message('Password must be strong (upper, lower, number)')
    .required(),
});
