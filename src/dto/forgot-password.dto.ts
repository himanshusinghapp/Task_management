import Joi from 'joi';

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().max(100).required(),
});
