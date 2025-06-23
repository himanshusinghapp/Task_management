import Joi from 'joi';
import { Types } from 'mongoose';

const objectId = (value: string, helpers: any) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', { message: 'Must be a valid ObjectId' });
  }
  return value;
};

export const commentDto = Joi.object({
  content: Joi.string().trim().min(1).max(1000).required().messages({
    'string.base': 'Content must be a string',
    'string.empty': 'Content cannot be empty',
    'string.max': 'Content cannot exceed 1000 characters',
    'any.required': 'Content is required',
  }),
  parentId: Joi.string().custom(objectId).optional().allow(null),
  taskId: Joi.string().custom(objectId).required().messages({
    'any.invalid': 'taskId must be a valid ObjectId',
    'any.required': 'taskId is required',
  }),
});

export const updateCommentDto = Joi.object({
  content: Joi.string().trim().min(1).max(1000).required().messages({
    'string.base': 'Content must be a string',
    'string.empty': 'Content cannot be empty',
    'string.max': 'Content cannot exceed 1000 characters',
    'any.required': 'Content is required',
  })
});

export const commentIdDto = Joi.object({
  commentId: Joi.string().custom(objectId).required().messages({
    'any.invalid': 'commentId must be a valid ObjectId',
    'any.required': 'commentId is required',
  }),
});

export const taskIdDto = Joi.object({
  taskId: Joi.string().custom(objectId).required().messages({
    'any.invalid': 'taskId must be a valid ObjectId',
    'any.required': 'taskId is required',
  }),
});

export const parentIdDto = Joi.object({
  parentId: Joi.string().custom(objectId).optional().allow(null),
});
  