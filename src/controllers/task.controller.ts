import { Response, NextFunction } from 'express';
import { TaskService } from '@services';
import { HTTP_STATUS ,USER_MESSAGES,LOGGER_MESSAGES} from '@common/constants';
import {  logControllerMethod, logControllerError } from '@utils';
import { AuthenticatedRequest } from '@middlewares';
import { ResponseHelper } from '@common/helpers';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskFilterDto,
  TaskLabelDto,
  UploadAttachmentsDto
} from '@dto';

const taskService = new TaskService();

export class TaskController {
  async createTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const body: CreateTaskDto = req.body;
      logControllerMethod('TaskController', 'createTask', LOGGER_MESSAGES.CREATE, { userId: user._id, role: user.role, ip: req.ip });
      
      const result = await taskService.createTask(body, user._id, user.role);
      
      if (!result) {
        throw new Error('Task creation failed');
      }
      logControllerMethod('TaskController', 'createTask', LOGGER_MESSAGES.CREATE, { userId: user._id, taskId: result._id, title: result.title });
      return res.status(HTTP_STATUS.CREATED).json(ResponseHelper.success(USER_MESSAGES.TASK_CREATED, result));
    } catch (err: any) {
      logControllerError('TaskController', 'createTask', err, { userId: req.user?._id, role: req.user?.role, ip: req.ip });
      return next(err);
    }
  }

  async getAllTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      logControllerMethod('TaskController', 'getAllTasks', LOGGER_MESSAGES.TASK_FETCHED, { userId: user._id, role: user.role, ip: req.ip });
      
      const result = await taskService.getAllTasks(user.role, user._id, req.query);
      
      logControllerMethod('TaskController', 'getAllTasks', LOGGER_MESSAGES.TASK_FETCHED, { userId: user._id, count: result.length });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASK_FETCHED, result || []));
    } catch (err: any) {
      logControllerError('TaskController', 'getAllTasks', err, { userId: req.user?._id, role: req.user?.role, ip: req.ip });
      return next(err);
    }
  }

  async getTaskById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { taskId } = req.params;
      logControllerMethod('TaskController', 'getTaskById', LOGGER_MESSAGES.TASK_FETCHED, { taskId, userId: user._id, role: user.role, ip: req.ip });
      
      const result = await taskService.getTaskById(taskId, user.role, user._id);
      
      logControllerMethod('TaskController', 'getTaskById', LOGGER_MESSAGES.TASK_FETCHED, { taskId, userId: user._id });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASK_FETCHED, result || []));
    } catch (err: any) {
      logControllerError('TaskController', 'getTaskById', err, { taskId: req.params.taskId, userId: req.user?._id, role: req.user?.role, ip: req.ip });
      return next(err);
    }
  }

  async updateTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { taskId } = req.params;
      const body: UpdateTaskDto = req.body;
      logControllerMethod('TaskController', 'updateTask', LOGGER_MESSAGES.UPDATE, { taskId, userId: user._id, role: user.role, updateData: Object.keys(body), ip: req.ip });
      
      const result = await taskService.updateTask(taskId, user._id, user.role, body);
      
      logControllerMethod('TaskController', 'updateTask', LOGGER_MESSAGES.UPDATE, { taskId, userId: user._id, updateData: Object.keys(body) });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASK_UPDATED, result || []));
    } catch (err: any) {
      logControllerError('TaskController', 'updateTask', err, { taskId: req.params.taskId, userId: req.user?._id, role: req.user?.role, updateData: Object.keys(req.body), ip: req.ip });
      return next(err);
    }
  }

  async deleteTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { taskId } = req.params;
      logControllerMethod('TaskController', 'deleteTask', LOGGER_MESSAGES.DELETE, { taskId, userId: user._id, role: user.role, ip: req.ip });
      
      const result = await taskService.deleteTask(taskId, user.role, user._id);
      
      logControllerMethod('TaskController', 'deleteTask', LOGGER_MESSAGES.DELETE, { taskId, userId: user._id });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASK_DELETED, result || []));
    } catch (err: any) {
      logControllerError('TaskController', 'deleteTask', err, { taskId: req.params.taskId, userId: req.user?._id, role: req.user?.role, ip: req.ip });
      return next(err);
    }
  }

  async uploadAttachments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { taskId } = req.params;
      const files = (req.files as Express.Multer.File[])?.map(f => (f as any).filename) || [];
      const body: UploadAttachmentsDto = { taskId, files };
      logControllerMethod('TaskController', 'uploadAttachments', LOGGER_MESSAGES.UPLOAD_ATTACHMENT, { taskId, userId: user._id, role: user.role, filesCount: files?.length, ip: req.ip });
      
      const result = await taskService.uploadAttachments(body.taskId, body.files, user.role, user._id);
      
      logControllerMethod('TaskController', 'uploadAttachments', LOGGER_MESSAGES.UPLOAD_ATTACHMENT, { taskId, userId: user._id, filesCount: files?.length });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.ATTACHMENT_UPLOADED, result || []));
    } catch (err: any) {
      logControllerError('TaskController', 'uploadAttachments', err, { taskId: req.params.taskId, userId: req.user?._id, role: req.user?.role, filesCount: req.files?.length, ip: req.ip });
      return next(err);
    }
  }

  async filterTasksByMonthYear(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { month, year } = req.query;
      const filter: TaskFilterDto = { month: Number(month), year: Number(year) };
      logControllerMethod('TaskController', 'filterTasksByMonthYear', LOGGER_MESSAGES.TASK_FETCHED, { userId: user._id, role: user.role, month, year, ip: req.ip });
      
      const result = await taskService.filterTasksByMonthYear(user._id, user.role, filter.month, filter.year);
      
      logControllerMethod('TaskController', 'filterTasksByMonthYear', LOGGER_MESSAGES.TASK_FETCHED, { userId: user._id, month, year, count: result.length });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASK_FETCHED, result || []));
    } catch (err: any) {
      logControllerError('TaskController', 'filterTasksByMonthYear', err, { userId: req.user?._id, role: req.user?.role, month: req.query?.month, year: req.query?.year, ip: req.ip });
      return next(err);
    }
  }

  async getTasksByLabel(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { label } = req.params;
      const labelDto: TaskLabelDto = { label };
      logControllerMethod('TaskController', 'getTasksByLabel', LOGGER_MESSAGES.TASK_FETCHED, { label, userId: user._id, role: user.role, ip: req.ip });
      
      const result = await taskService.getTasksByLabel(labelDto.label, user._id, user.role);
      
      logControllerMethod('TaskController', 'getTasksByLabel', LOGGER_MESSAGES.TASK_FETCHED, { label, userId: user._id, count: result.length });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASK_FETCHED, result || []));
    } catch (err: any) {
      logControllerError('TaskController', 'getTasksByLabel', err, { label: req.params.label, userId: req.user?._id, role: req.user?.role, ip: req.ip });
      return next(err);
    }
  }
}