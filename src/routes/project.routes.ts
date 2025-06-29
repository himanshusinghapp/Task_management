import { Router } from 'express';
import { ProjectController } from '@controllers/project.controller';
import { Auth } from '@middlewares/auth.middleware';
import { Validate } from '@middlewares/validate';
import Joi from 'joi';
import { USER_MESSAGES } from '@common/constants/userMessage';

const router = Router();
const controller = new ProjectController();

const objectId = (value: string, helpers: any) => {
  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', { message: USER_MESSAGES.INVALID_OBJECT_ID });
  }
  return value;
};

router.post(
  '/',
  Auth.authenticate('admin'),
  Validate.middleware(
    Joi.object({
      name: Joi.string().trim().min(3).max(100).required().messages({
        'string.base': USER_MESSAGES.PROJECT_NAME_EXISTS,
        'string.empty': USER_MESSAGES.PROJECT_NAME_EXISTS,
        'string.min': USER_MESSAGES.PROJECT_NAME_EXISTS,
        'string.max': USER_MESSAGES.PROJECT_NAME_EXISTS,
        'any.required': USER_MESSAGES.PROJECT_NAME_EXISTS,
      }),
      description: Joi.string().trim().max(1000).optional().messages({
        'string.max': USER_MESSAGES.PROJECT_UPDATED,
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
        'string.base': USER_MESSAGES.PROJECT_NAME_EXISTS,
        'string.min': USER_MESSAGES.PROJECT_NAME_EXISTS,
        'string.max': USER_MESSAGES.PROJECT_NAME_EXISTS,
      }),
      description: Joi.string().trim().max(1000).optional().messages({
        'string.max': USER_MESSAGES.PROJECT_UPDATED,
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
        'any.invalid': USER_MESSAGES.INVALID_OBJECT_ID,
      })).min(1).required().messages({
        'array.base': USER_MESSAGES.MEMBERS_ASSIGNED,
        'array.min': USER_MESSAGES.MEMBERS_ASSIGNED,
        'any.required': USER_MESSAGES.MEMBERS_ASSIGNED,
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
        'any.invalid': USER_MESSAGES.INVALID_OBJECT_ID,
      })).min(1).required().messages({
        'array.base': USER_MESSAGES.MEMEBERS_REMOVED,
        'array.min': USER_MESSAGES.MEMEBERS_REMOVED,
        'any.required': USER_MESSAGES.MEMEBERS_REMOVED,
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
        'any.invalid': USER_MESSAGES.INVALID_OBJECT_ID,
      })).min(1).required().messages({
        'array.base': USER_MESSAGES.TASKS_ASSIGNED,
        'array.min': USER_MESSAGES.TASKS_ASSIGNED,
        'any.required': USER_MESSAGES.TASKS_ASSIGNED,
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
        'any.invalid': USER_MESSAGES.INVALID_OBJECT_ID,
      })).min(1).required().messages({
        'array.base': USER_MESSAGES.TASK_REMOVED,
        'array.min': USER_MESSAGES.TASK_REMOVED,
        'any.required': USER_MESSAGES.TASK_REMOVED,
      }),
    })
  ),
  (req, res, next) => controller.removeTasks(req, res, next)
);

router.get('/', Auth.authenticate('admin'), (req, res, next) => controller.getProjects(req, res, next));

export default router;
