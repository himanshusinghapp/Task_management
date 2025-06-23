import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().max(100).required(),
  password: Joi.string().trim().max(100).required(),
});
