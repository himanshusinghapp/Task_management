import Joi from 'joi';

export const signupSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
    .message('Password must include upper, lower, number and be at least 8 characters')
    .required(),
});
