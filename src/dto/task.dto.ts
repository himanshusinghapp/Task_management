import Joi, { CustomValidator } from 'joi';
import { Types } from 'mongoose';

// Custom validator for MongoDB ObjectId
const objectId: CustomValidator<string> = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', { message: 'Must be a valid ObjectId' });
  }
  return value;
};

export const taskIdDto = Joi.object({
  taskId: Joi.string().custom(objectId).required(),
});
export const labelDto = Joi.object({
  label: Joi.string().trim().min(1).max(50).required(),
});


export const createTaskDto = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    'string.base': 'Title must be a string',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().trim().allow('').max(1000).default('').messages({
    'string.max': 'Description cannot exceed 1000 characters',
  }),
  dueDate: Joi.date().iso().greater('now').optional().messages({
    'date.base': 'Due date must be a valid date',
    'date.greater': 'Due date must be in the future',
  }),
  priority: Joi.string().valid('low', 'medium', 'high').optional().default('medium').messages({
    'any.only': 'Priority must be one of: low, medium, high',
  }),
  assignedTo: Joi.string()
    .custom(objectId)
    .optional()
    .messages({
      'any.required': 'Assigned user is required',
      'any.invalid': 'Assigned user ID must be a valid ObjectId',
    }),
  assignedBy: Joi.string()
    .custom(objectId)
    .optional()
    .messages({
      'any.invalid': 'Assigned by ID must be a valid ObjectId',
    }),
  labels: Joi.array()
    .items(Joi.string().trim().min(1).max(50))
    .unique()
    .optional()
    .default([])
    .messages({
      'string.min': 'Each label must be at least 1 character',
      'string.max': 'Each label cannot exceed 50 characters',
      'array.unique': 'Labels must be unique',
    }),
  blockedBy: Joi.array()
    .items(Joi.string().custom(objectId))
    .unique()
    .optional()
    .default([])
    .messages({
      'any.invalid': 'Blocked by task IDs must be valid ObjectIds',
      'array.unique': 'Blocked by task IDs must be unique',
    }),
});

export const updateTaskDto = Joi.object({
  title: Joi.string().trim().min(3).max(100).optional().messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 100 characters',
  }),
  description: Joi.string().trim().allow('').max(1000).optional().messages({
    'string.max': 'Description cannot exceed 1000 characters',
  }),
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed')
    .optional()
    .messages({
      'any.only': 'Status must be one of: pending, in-progress, completed',
    }),
  dueDate: Joi.date().iso().optional().messages({
    'date.base': 'Due date must be a valid date',
  }),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional()
    .messages({
      'any.only': 'Priority must be one of: low, medium, high',
    }),
  labels: Joi.array()
    .items(Joi.string().trim().min(1).max(50))
    .unique()
    .optional()
    .messages({
      'string.min': 'Each label must be at least 1 character',
      'string.max': 'Each label cannot exceed 50 characters',
      'array.unique': 'Labels must be unique',
    }),
  blockedBy: Joi.array()
    .items(Joi.string().custom(objectId))
    .unique()
    .optional()
    .messages({
      'any.invalid': 'Blocked by task IDs must be valid ObjectIds',
      'array.unique': 'Blocked by task IDs must be unique',
    }),
});