import Joi from 'joi';

export const editProfileSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).optional(),
  email: Joi.string().trim().email().max(100).optional(),
});
