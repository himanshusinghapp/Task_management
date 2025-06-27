import { Router } from 'express';
import { ProjectController } from '@controllers/project.controller';
import { Auth } from '@middlewares/auth.middleware';
import { Validate } from '@middlewares/validate';
import Joi from 'joi';

const router = Router();
const controller = new ProjectController();

const objectId = (value: string, helpers: any) => {
  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', { message: 'Must be a valid ObjectId' });
  }
  return value;
};

router.post(
  '/',
  Auth.authenticate('admin'),
  Validate.middleware(
    Joi.object({
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
    })
  ),
  (req, res, next) => controller.createProject(req, res, next)
);

router.patch(
  '/:projectId',
  Auth.authenticate('admin'),
  Validate.middleware(
    Joi.object({
      name: Joi.string().trim().min(3).max(100).optional().messages({
        'string.base': 'Project name must be a string',
        'string.min': 'Project name must be at least 3 characters',
        'string.max': 'Project name must be at most 100 characters',
      }),
      description: Joi.string().trim().max(1000).optional().messages({
        'string.max': 'Description must be at most 1000 characters',
      }),
    })
  ),
  (req, res, next) => controller.updateProject(req, res, next)
);

router.delete('/:projectId', Auth.authenticate('admin'), (req, res, next) => controller.deleteProject(req, res, next));

router.post(
  '/:projectId/assign-members',
  Auth.authenticate('admin'),
  Validate.middleware(
    Joi.object({
      memberIds: Joi.array().items(Joi.string().custom(objectId).messages({
        'any.invalid': 'Each memberId must be a valid ObjectId',
      })).min(1).required().messages({
        'array.base': 'memberIds must be an array',
        'array.min': 'At least one memberId is required',
        'any.required': 'memberIds is required',
      }),
    })
  ),
  (req, res, next) => controller.assignMembers(req, res, next)
);

router.patch(
  '/:projectId/remove-members',
  Auth.authenticate('admin'),
  Validate.middleware(
    Joi.object({
      memberIds: Joi.array().items(Joi.string().custom(objectId).messages({
        'any.invalid': 'Each memberId must be a valid ObjectId',
      })).min(1).required().messages({
        'array.base': 'memberIds must be an array',
        'array.min': 'At least one memberId is required',
        'any.required': 'memberIds is required',
      }),
    })
  ),
  (req, res, next) => controller.removeMembers(req, res, next)
);

router.post(
  '/:projectId/assign-tasks',
  Auth.authenticate('admin'),
  Validate.middleware(
    Joi.object({
      taskIds: Joi.array().items(Joi.string().custom(objectId).messages({
        'any.invalid': 'Each taskId must be a valid ObjectId',
      })).min(1).required().messages({
        'array.base': 'taskIds must be an array',
        'array.min': 'At least one taskId is required',
        'any.required': 'taskIds is required',
      }),
    })
  ),
  (req, res, next) => controller.assignTasks(req, res, next)
);

router.patch(
  '/:projectId/remove-tasks',
  Auth.authenticate('admin'),
  Validate.middleware(
    Joi.object({
      taskIds: Joi.array().items(Joi.string().custom(objectId).messages({
        'any.invalid': 'Each taskId must be a valid ObjectId',
      })).min(1).required().messages({
        'array.base': 'taskIds must be an array',
        'array.min': 'At least one taskId is required',
        'any.required': 'taskIds is required',
      }),
    })
  ),
  (req, res, next) => controller.removeTasks(req, res, next)
);

router.get('/', Auth.authenticate('admin'), (req, res, next) => controller.getProjects(req, res, next));

export default router;
