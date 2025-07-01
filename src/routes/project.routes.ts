import { Router } from 'express';
import { ProjectController } from '@controllers';
import { Auth, Validate } from '@middlewares';
import Joi from 'joi';
import { ROLE, USER_MESSAGES } from '@common/constants';
import { validateObject } from '@/common/helpers';

const router = Router();
const controller = new ProjectController();

const validateObjectInstance = new validateObject();

const projectIdParam = Joi.object({
  projectId: Joi.string().custom(validateObjectInstance.objectId).required(),
});

router.post(
  '/',
  Auth.authenticate(ROLE.ADMIN),
  Validate.body(
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
  controller.createProject
);

router.patch(
  '/:projectId',
  Auth.authenticate(ROLE.ADMIN),
  Validate.params(projectIdParam),
  Validate.body(
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
  controller.updateProject
);

router.delete(
  '/:projectId',
  Auth.authenticate(ROLE.ADMIN),
  Validate.params(projectIdParam),
  controller.deleteProject
);

router.post(
  '/:projectId/assign-members',
  Auth.authenticate(ROLE.ADMIN),
  Validate.params(projectIdParam),
  Validate.body(
    Joi.object({
      memberIds: Joi.array().items(Joi.string().custom(validateObjectInstance.objectId).messages({
        'any.invalid': USER_MESSAGES.INVALID_OBJECT_ID,
      })).min(1).required().messages({
        'array.base': USER_MESSAGES.MEMBERS_ASSIGNED,
        'array.min': USER_MESSAGES.MEMBERS_ASSIGNED,
        'any.required': USER_MESSAGES.MEMBERS_ASSIGNED,
      }),
    })
  ),
   controller.assignMembers
);

router.patch(
  '/:projectId/remove-members',
  Auth.authenticate(ROLE.ADMIN),
  Validate.params(projectIdParam),
  Validate.body(
    Joi.object({
      memberIds: Joi.array().items(Joi.string().custom(validateObjectInstance.objectId).messages({
        'any.invalid': USER_MESSAGES.INVALID_OBJECT_ID,
      })).min(1).required().messages({
        'array.base': USER_MESSAGES.MEMEBERS_REMOVED,
        'array.min': USER_MESSAGES.MEMEBERS_REMOVED,
        'any.required': USER_MESSAGES.MEMEBERS_REMOVED,
      }),
    })
  ),
   controller.removeMembers
);

router.post(
  '/:projectId/assign-tasks',
  Auth.authenticate(ROLE.ADMIN),
  Validate.params(projectIdParam),
  Validate.body(
    Joi.object({
      taskIds: Joi.array().items(Joi.string().custom(validateObjectInstance.objectId).messages({
        'any.invalid': USER_MESSAGES.INVALID_OBJECT_ID,
      })).min(1).required().messages({
        'array.base': USER_MESSAGES.TASKS_ASSIGNED,
        'array.min': USER_MESSAGES.TASKS_ASSIGNED,
        'any.required': USER_MESSAGES.TASKS_ASSIGNED,
      }),
    })
  ),
  controller.assignTasks
);

router.patch(
  '/:projectId/remove-tasks/',
  Auth.authenticate(ROLE.ADMIN),
  Validate.params(projectIdParam),
  Validate.body(
    Joi.object({
      taskIds: Joi.array().items(Joi.string().custom(validateObjectInstance.objectId).messages({
        'any.invalid': USER_MESSAGES.INVALID_OBJECT_ID,
      })).min(1).required().messages({
        'array.base': USER_MESSAGES.TASK_REMOVED,
        'array.min': USER_MESSAGES.TASK_REMOVED,
        'any.required': USER_MESSAGES.TASK_REMOVED,
      }),
    })
  ),
  controller.removeTasks
);

router.get('/', Auth.authenticate(ROLE.ADMIN),  controller.getProjects);

export default router;
