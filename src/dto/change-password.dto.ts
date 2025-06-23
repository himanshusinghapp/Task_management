import Joi from 'joi';

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().max(100).required(),
  newPassword: Joi.string()
    .min(8)
    .max(100)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
    .message('Password must be strong (upper, lower, number)')
    .required(),
});
