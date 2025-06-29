import { Router } from 'express';
import { TaskController } from '@controllers/task.controller';
import { Auth } from '@middlewares/auth.middleware';
import { upload } from '@utils/multer';
import { Validate } from '@middlewares/validate';
import Joi from 'joi';
import { USER_MESSAGES } from '@common/constants/userMessage';
import { TASK_STATUS, TASK_PRIORITY } from '@common/constants/task.constants';

const router = Router();
const controller = new TaskController();

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
      title: Joi.string().trim().min(3).max(100).required(),
      description: Joi.string().trim().allow('').max(1000).default(''),
      dueDate: Joi.date().iso().greater('now').optional(),
      priority: Joi.string().valid(
        TASK_PRIORITY.LOW,
        TASK_PRIORITY.MEDIUM,
        TASK_PRIORITY.HIGH
      ).optional().default(TASK_PRIORITY.MEDIUM),
      assignedTo: Joi.string().custom(objectId).optional(),
      assignedBy: Joi.string().custom(objectId).optional(),
      labels: Joi.array().items(Joi.string().trim().min(1).max(50)).unique().optional().default([]),
      blockedBy: Joi.array().items(Joi.string().custom(objectId)).unique().optional().default([]),
    })
  ),
  controller.createTask
);

router.get('/', Auth.authenticate('user'), controller.getAllTasks); // Admin sees all, user sees assigned
router.get(
  '/:taskId',
  Auth.authenticate('user'),
  controller.getTaskById
);
router.put(
  '/:taskId',
  Auth.authenticate('user'),
  Validate.middleware(
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
      blockedBy: Joi.array().items(Joi.string().custom(objectId)).unique().optional(),
    })
  ),
  controller.updateTask
);
router.delete(
  '/:taskId',
  Auth.authenticate('user'),
  controller.deleteTask
);

router.post(
  '/:taskId/attachments',
  Auth.authenticate('user'),
  upload.array('attachments'), 
  controller.uploadAttachments
);

router.get(
  '/filter/by-label/:label',
  Auth.authenticate('user'),
  Validate.middleware(
    Joi.object({
      label: Joi.string().trim().min(1).max(50).required(),
    })
  ),
  controller.getTasksByLabel
);

router.get('/filter/by-date/:month/:year', Auth.authenticate('user'), controller.filterTasksByMonthYear);

export default router;
