import Joi from 'joi';

export const signupSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  email: Joi.string().trim().email().max(100).required(),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
    .message('Password must include upper, lower, number and be at least 8 characters')
    .required(),
});
