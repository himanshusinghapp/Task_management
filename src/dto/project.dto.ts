import Joi from 'joi';
import { Types } from 'mongoose';

const objectId = (value: string, helpers: any) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', { message: 'Must be a valid ObjectId' });
  }
  return value;
};

export const createProjectDto = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    'string.base': 'Project name must be a string',
    'string.empty': 'Project name is required',
    'string.min': 'Project name must be at least 3 characters',
    'string.max': 'Project name must be at most 100 characters',
    'any.required': 'Project name is required',
  }),
  description: Joi.string().trim().max(1000).optional().messages({
    'string.max': 'Description must be at most 1000 characters',
  }),
});

export const updateProjectDto = Joi.object({
  name: Joi.string().trim().min(3).max(100).optional().messages({
    'string.base': 'Project name must be a string',
    'string.min': 'Project name must be at least 3 characters',
    'string.max': 'Project name must be at most 100 characters',
  }),
  description: Joi.string().trim().max(1000).optional().messages({
    'string.max': 'Description must be at most 1000 characters',
  }),
});

export const assignMembersDto = Joi.object({
  memberIds: Joi.array().items(Joi.string().custom(objectId).messages({
    'any.invalid': 'Each memberId must be a valid ObjectId',
  })).min(1).required().messages({
    'array.base': 'memberIds must be an array',
    'array.min': 'At least one memberId is required',
    'any.required': 'memberIds is required',
  }),
});

export const removeMembersDto = Joi.object({
  memberIds: Joi.array().items(Joi.string().custom(objectId).messages({
    'any.invalid': 'Each memberId must be a valid ObjectId',
  })).min(1).required().messages({
    'array.base': 'memberIds must be an array',
    'array.min': 'At least one memberId is required',
    'any.required': 'memberIds is required',
  }),
});

export const assignTasksDto = Joi.object({
  taskIds: Joi.array().items(Joi.string().custom(objectId).messages({
    'any.invalid': 'Each taskId must be a valid ObjectId',
  })).min(1).required().messages({
    'array.base': 'taskIds must be an array',
    'array.min': 'At least one taskId is required',
    'any.required': 'taskIds is required',
  }),
});

export const removeTasksDto = Joi.object({
  taskIds: Joi.array().items(Joi.string().custom(objectId).messages({
    'any.invalid': 'Each taskId must be a valid ObjectId',
  })).min(1).required().messages({
    'array.base': 'taskIds must be an array',
    'array.min': 'At least one taskId is required',
    'any.required': 'taskIds is required',
  }),
});

export const projectIdDto = Joi.object({
  projectId: Joi.string().custom(objectId).required().messages({
    'any.invalid': 'projectId must be a valid ObjectId',
    'any.required': 'projectId is required',
  }),
}); 