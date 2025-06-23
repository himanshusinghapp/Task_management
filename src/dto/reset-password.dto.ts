import Joi from 'joi';

export const resetPasswordSchema = Joi.object({
  userId: Joi.string().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
    .message('Password must be strong (upper, lower, number)')
    .required(),
});
