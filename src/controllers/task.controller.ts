import { Request, Response, NextFunction } from 'express';
import { TaskService } from '@services/task.service';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import { USER_MESSAGES } from '@common/constants/userMessage';
import { logMessage } from '@utils/logger';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';
import { AuthenticatedRequest } from '@middlewares/auth.middleware';
import { ResponseHelper } from '@common/helpers/response.helper';
import { CreateTaskDto, UpdateTaskDto } from '@dto/task.dto';

const taskService = new TaskService();

export class TaskController {
  async createTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id?.toString();
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      if (!userId) throw new Error('User ID not found');
      const body: CreateTaskDto = req.body;
      const result = await taskService.createTask(body, userId, role);
      if (!result ) {
        logMessage('warn', LOGGER_MESSAGES.CREATE, { error: USER_MESSAGES.TASK_CREATE_FAILED });
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(ResponseHelper.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, USER_MESSAGES.TASK_CREATE_FAILED));
      }
      logMessage('info', LOGGER_MESSAGES.CREATE, { taskId: result._id });
      return res
        .status(HTTP_STATUS.CREATED)
        .json(ResponseHelper.created(USER_MESSAGES.TASK_CREATED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.CREATE, { error: err.message });
      return next(err);
    }
  }

  async getAllTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      const userId = req.user?._id?.toString();
      if (!userId) throw new Error(USER_MESSAGES.MISSING_USER_ID);
      const tasks = await taskService.getAllTasks(role, userId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASK_FETCHED, tasks));
    } catch (err: any) {
      return next(err);
    }
  }

  async getTaskById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      const userId = req.user?._id?.toString();
      if (!userId) throw new Error(USER_MESSAGES.MISSING_USER_ID);
      const task = await taskService.getTaskById(taskId, role, userId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASK_FETCHED, task));
    } catch (err: any) {
      return next(err);
    }
  }

  async updateTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      const userId = req.user?._id?.toString();
      if (!userId) throw new Error(USER_MESSAGES.MISSING_USER_ID);
      const body: UpdateTaskDto = req.body;
      const updated = await taskService.updateTask(taskId, userId, role, body);
      logMessage('info', LOGGER_MESSAGES.UPDATE, { taskId: taskId });
      return res
        .status(HTTP_STATUS.OK)
        .json(ResponseHelper.success(USER_MESSAGES.TASK_UPDATED, updated));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.UPDATE, { error: err.message });
      return next(err);
    }
  }

  async deleteTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      const userId = req.user?._id?.toString();
      if (!userId) throw new Error(USER_MESSAGES.MISSING_USER_ID);
      const result = await taskService.deleteTask(taskId, role, userId);
      logMessage('info', LOGGER_MESSAGES.DELETE, { taskId });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASK_DELETED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.DELETE, { error: err.message });
      return next(err);
    }
  }

  async uploadAttachments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      const userId = req.user?._id?.toString();
      if (!userId) throw new Error(USER_MESSAGES.MISSING_USER_ID);
      const files = (req.files as Express.Multer.File[])?.map((file) => file.path) || [];
      if (!files.length) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, USER_MESSAGES.MISSING_FILE));
      }
      const result = await taskService.uploadAttachments(taskId, files, role, userId);
      logMessage('info', LOGGER_MESSAGES.UPLOAD_ATTACHMENT, { taskId });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.ATTACHMENT_UPLOADED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.UPLOAD_ATTACHMENT, { error: err.message });
      return next(err);
    }
  }

  async filterTasksByMonthYear(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { month, year } = req.query;
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      const userId = req.user?._id?.toString();
      if (!userId) throw new Error(USER_MESSAGES.MISSING_USER_ID);
      const result = await taskService.filterTasksByMonthYear(
        userId,
        role,
        Number(month),
        Number(year)
      );
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASK_FILTERED, result));
    } catch (err: any) {
      return next(err);
    }
  }

  async getTasksByLabel(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { label } = req.params;
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      const userId = req.user?._id?.toString();
      if (!userId) throw new Error(USER_MESSAGES.MISSING_USER_ID);
      const result = await taskService.getTasksByLabel(label, userId, role);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASK_LEVEL_FETCHED, result));
    } catch (err: any) {
      return next(err);
    }
  }
}