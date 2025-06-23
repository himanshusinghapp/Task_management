import Joi from 'joi';

export const editProfileSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  email: Joi.string().email().optional(),
});
