import { Router } from 'express';
import { TaskController } from '@controllers';
import { Auth, Validate} from '@middlewares';
import Joi from 'joi';
import { TASK_STATUS, TASK_PRIORITY, ROLE  } from '@common/constants';
import { MulterUtil } from '@utils';
import { ValidateObject } from '@/common/helpers';
const router = Router();
const controller = new TaskController();

const validateObjectInstance = new ValidateObject();

const objectIdParam = Joi.object({
  taskId: Joi.string().custom(validateObjectInstance.objectId).required(),
});

const labelParam = Joi.object({
  label: Joi.string().trim().min(1).max(50).required(),
});

const monthYearParam = Joi.object({
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(2000).max(9999).required(),
});

const getAllTasksQuery = Joi.object({
  status: Joi.string().valid(TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED).optional(),
  priority: Joi.string().valid(TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH).optional(),
  assignedTo: Joi.string().custom(validateObjectInstance.objectId).optional(),
  projectId: Joi.string().custom(validateObjectInstance.objectId).optional(),
  label: Joi.string().trim().min(1).max(50).optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});

router.post(
  '/',
  Auth.authenticate([ROLE.USER]),
  Validate.body(
    Joi.object({
      title: Joi.string().trim().min(3).max(100).required(),
      description: Joi.string().trim().allow('').max(1000).default(''),
      dueDate: Joi.date().iso().greater('now').optional(),
      priority: Joi.string().valid(
        TASK_PRIORITY.LOW,
        TASK_PRIORITY.MEDIUM,
        TASK_PRIORITY.HIGH
      ).optional().default(TASK_PRIORITY.MEDIUM),
      assignedTo: Joi.string().custom(validateObjectInstance.objectId).optional(),
      // assignedBy: Joi.string().custom(validateObjectInstance.objectId).optional(),
      labels: Joi.array().items(Joi.string().trim().min(1).max(50)).unique().optional().default([]),
      blockedBy: Joi.array().items(Joi.string().custom(validateObjectInstance.objectId)).unique().optional().default([]),
    })
  ),
  controller.createTask
);

router.get(
  '/',
  Auth.authenticate([ROLE.USER,ROLE.ADMIN]),
  controller.getAllTasks
);

router.get(
  '/:taskId',
  Auth.authenticate([ROLE.USER]),
  Validate.params(objectIdParam),
  controller.getTaskById
);

router.put(
  '/:taskId',
  Auth.authenticate([ROLE.USER]),
  Validate.params(objectIdParam),
  Validate.body(
    Joi.object({
      title: Joi.string().trim().min(3).max(100).optional(),
      description: Joi.string().trim().allow('').max(1000).optional(),
      status: Joi.string().valid(
        TASK_STATUS.PENDING,
        TASK_STATUS.IN_PROGRESS,
        TASK_STATUS.COMPLETED
      ).optional(),
      dueDate: Joi.date().iso().optional(),
      priority: Joi.string().valid(
        TASK_PRIORITY.LOW,
        TASK_PRIORITY.MEDIUM,
        TASK_PRIORITY.HIGH
      ).optional(),
      labels: Joi.array().items(Joi.string().trim().min(1).max(50)).unique().optional(),
      blockedBy: Joi.array().items(Joi.string().custom(validateObjectInstance.objectId)).unique().optional(),
    })
  ),
  controller.updateTask
);

router.delete(
  '/:taskId',
  Auth.authenticate([ROLE.ADMIN]),
  Validate.params(objectIdParam),
  controller.deleteTask
);

router.post(
  '/:taskId/attachments',
  Auth.authenticate([ROLE.USER , ROLE.ADMIN]),
  Validate.params(objectIdParam),
  MulterUtil.getUploader().array('attachments'), 
  controller.uploadAttachments
);

router.get(
  '/filter/:label',
  Auth.authenticate([ROLE.USER,ROLE.ADMIN]),
  Validate.params(labelParam),
  controller.getTasksByLabel
);

router.get(
  '/filter/:month/:year',
  Auth.authenticate([ROLE.USER,ROLE.ADMIN]),
  Validate.query(monthYearParam),
  controller.filterTasksByMonthYear
);

export default router;
