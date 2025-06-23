import { Request, Response } from 'express';
import { TaskService } from '@services/task.service';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import { USER_MESSAGES } from '@common/constants/userMessage';
import { logMessage } from '@utils/logger';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';
import { createTaskDto, updateTaskDto ,labelDto,taskIdDto} from '@dto/task.dto';
import { AuthenticatedRequest } from '@middlewares/auth.middleware';
import { ResponseHelper } from '@common/helpers/response.helper';

const taskService = new TaskService();

export class TaskController {
  async createTask(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      if (!userId) throw new Error('User ID not found');

      const { error } = createTaskDto.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.details.map((e) => e.message).join(', ')));
      }

      const result = await taskService.createTask(req.body, userId, role);
      if (!result ) {
        logMessage('warn', LOGGER_MESSAGES.CREATE, { error: 'Task creation returned null task' });
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(ResponseHelper.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Task creation failed'));
      }
      logMessage('info', LOGGER_MESSAGES.CREATE, { taskId: result._id });
      return res
        .status(HTTP_STATUS.CREATED)
        .json(ResponseHelper.created(USER_MESSAGES.TASK_CREATED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.CREATE, { error: err.message });
      return res
        .status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(ResponseHelper.error(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message));
    }
  }

  async getAllTasks(req: AuthenticatedRequest, res: Response) {
    try {
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      const userId = req.user?._id?.toString();
      if (!userId) throw new Error('User ID not found');
      const tasks = await taskService.getAllTasks(role, userId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Tasks fetched successfully', tasks));
    } catch (err: any) {
      return res
        .status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(ResponseHelper.error(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message));
    }
  }

  async getTaskById(req: AuthenticatedRequest, res: Response) {
    try {
      const { taskId } = req.params;
      const { error } = taskIdDto.validate({ taskId });
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.message));
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      const userId = req.user?._id?.toString();
      if (!userId) throw new Error('User ID not found');
      const task = await taskService.getTaskById(taskId, role, userId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Task fetched successfully', task));
    } catch (err: any) {
      return res
        .status(err.status || HTTP_STATUS.NOT_FOUND)
        .json(ResponseHelper.error(err.status || HTTP_STATUS.NOT_FOUND, err.message));
    }
  }

  async updateTask(req: AuthenticatedRequest, res: Response) {
    try {
      const { taskId } = req.params;
      const { error: paramError } = taskIdDto.validate({ taskId });
      if (paramError) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, paramError.message));
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      const userId = req.user?._id?.toString();
      if (!userId) throw new Error('User ID not found');

      const { error } = updateTaskDto.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.details.map((e) => e.message).join(', ')));
      }

      const updated = await taskService.updateTask(taskId, userId, role, req.body);
      logMessage('info', LOGGER_MESSAGES.UPDATE, { taskId: taskId });
      return res
        .status(HTTP_STATUS.OK)
        .json(ResponseHelper.success(USER_MESSAGES.TASK_UPDATED, updated));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.UPDATE, { error: err.message });
      return res
        .status(err.status || HTTP_STATUS.BAD_REQUEST)
        .json(ResponseHelper.error(err.status || HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async deleteTask(req: AuthenticatedRequest, res: Response) {
    try {
      const { taskId } = req.params;
      const { error } = taskIdDto.validate({ taskId });
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.message));
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      const userId = req.user?._id?.toString();
      if (!userId) throw new Error('User ID not found');
      const result = await taskService.deleteTask(taskId, role, userId);
      logMessage('info', LOGGER_MESSAGES.DELETE, { taskId });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASK_DELETED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.DELETE, { error: err.message });
      return res
        .status(err.status || HTTP_STATUS.BAD_REQUEST)
        .json(ResponseHelper.error(err.status || HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async uploadAttachments(req: AuthenticatedRequest, res: Response) {
    try {
      const { taskId } = req.params;
      const { error } = taskIdDto.validate({ taskId });
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.message));
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      const userId = req.user?._id?.toString();
      if (!userId) throw new Error('User ID not found');
      const files = (req.files as Express.Multer.File[])?.map((file) => file.path) || [];
      if (!files.length) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, 'No files uploaded'));
      }
      const result = await taskService.uploadAttachments(taskId, files, role, userId);
      logMessage('info', LOGGER_MESSAGES.UPLOAD_ATTACHMENT, { taskId });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Attachments uploaded successfully', result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.UPLOAD_ATTACHMENT, { error: err.message });
      return res
        .status(err.status || HTTP_STATUS.BAD_REQUEST)
        .json(ResponseHelper.error(err.status || HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async filterTasksByMonthYear(req: AuthenticatedRequest, res: Response) {
    try {
      const { month, year } = req.query;
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      const userId = req.user?._id?.toString();
      if (!userId) throw new Error('User ID not found');
      const result = await taskService.filterTasksByMonthYear(
        userId,
        role,
        Number(month),
        Number(year)
      );
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Tasks filtered by month/year', result));
    } catch (err: any) {
      return res
        .status(err.status || HTTP_STATUS.BAD_REQUEST)
        .json(ResponseHelper.error(err.status || HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async getTasksByLabel(req: AuthenticatedRequest, res: Response) {
    try {
      const { label } = req.params;
      const { error } = labelDto.validate({ label });
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.message));
      const role = req.user?.role === 'admin' ? 'admin' : 'user';
      const userId = req.user?._id?.toString();
      if (!userId) throw new Error('User ID not found');
      const result = await taskService.getTasksByLabel(label, userId, role);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Tasks fetched by label', result));
    } catch (err: any) {
      return res
        .status(err.status || HTTP_STATUS.BAD_REQUEST)
        .json(ResponseHelper.error(err.status || HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }
}