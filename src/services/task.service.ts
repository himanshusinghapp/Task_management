import { Exceptions } from '@common/exception';
import { Task } from '@models';
import { CreateTaskDto, UpdateTaskDto } from '@dto';
import { validateObjectIdArray,getPagination ,validateObject} from '@common/helpers';
import { TASK_STATUS,LOGGER_MESSAGES,USER_MESSAGES, ROLE } from '@/common/constants';
import { logServiceMethod, logServiceError ,AuditUtil,taskQuery } from '@utils';
import mongoose from 'mongoose';

const validateObjectInstance = new validateObject();

export class TaskService {
  async createTask(data: CreateTaskDto, createdBy: string, role: string) {
    try {
      logServiceMethod('TaskService', 'createTask', LOGGER_MESSAGES.CREATE, { createdBy, role, title: data.title });
      
      if (role !== ROLE.ADMIN) {
        logServiceMethod('TaskService', 'createTask', LOGGER_MESSAGES.USER_CREATION_FAILED, { createdBy, role });
        throw Exceptions.Forbidden(USER_MESSAGES.ADMIN_ONLY_ASSIGN);
      }
      const value: CreateTaskDto = data;
      // value.assignedBy = createdBy;

      if (value.blockedBy?.length) {
        validateObjectIdArray(value.blockedBy, 'blockedBy');
        const blockers = await Task.find({ _id: { $in: value.blockedBy } });
        if (blockers.length !== value.blockedBy.length) {
          logServiceMethod('TaskService', 'createTask', LOGGER_MESSAGES.USER_CREATION_FAILED, { createdBy, blockedBy: value.blockedBy });
          throw Exceptions.BadRequest(USER_MESSAGES.INVALID_BLOCKED_BY);
        }
      }

      const task = await Task.create({ ...value, createdBy: new mongoose.Types.ObjectId(createdBy) });
      await AuditUtil.logActivity(
        createdBy,
        'CREATE_TASK',
        String(task._id),
        'Task',
        `Task "${task.title}" created by admin`
      );
      const populatedTask = await Task.findById(task._id)
        .populate('blockedBy assignedTo');
      
      logServiceMethod('TaskService', 'createTask', LOGGER_MESSAGES.CREATE, { taskId: task._id, createdBy, title: task.title });
      return populatedTask;
    } catch (error) {
      logServiceError('TaskService', 'createTask', error, { createdBy, role, title: data.title });
      throw Exceptions.InternalServerError(USER_MESSAGES.TASK_CREATE_FAILED);
    }
  }

  async getAllTasks(role: string, userId: string, query: any = {}) {
    try {
      logServiceMethod('TaskService', 'getAllTasks', LOGGER_MESSAGES.TASK_FETCHED, { role, userId, query });
      
      const { skip, limit } = getPagination(query);
      const tasks = await taskQuery.findAllTasksPaginated(role, userId, skip, limit);
      
      logServiceMethod('TaskService', 'getAllTasks', LOGGER_MESSAGES.TASK_FETCHED, { role, userId, count: tasks.length });
      return tasks;
    } catch (error) {
      logServiceError('TaskService', 'getAllTasks', error, { role, userId, query });
      throw error;
    }
  }

  async getTaskById(taskId: string, role: string, userId: string) {
    try {
      logServiceMethod('TaskService', 'getTaskById', LOGGER_MESSAGES.TASK_FETCHED, { taskId, role, userId });
      
      validateObjectInstance.validateObjectId(taskId, 'task ID');
      const task = await this.checkTask(taskId);
      const assignedToId = typeof task.assignedTo === 'object' && task.assignedTo !== null
        ? String(task.assignedTo._id)
        : String(task.assignedTo);
      
      if (role !== ROLE.USER && assignedToId !== userId) {
        logServiceMethod('TaskService', 'getTaskById', LOGGER_MESSAGES.TASK_FETCH_FAILED, { taskId, role, userId, assignedToId });
        throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);
      }
      
      logServiceMethod('TaskService', 'getTaskById', LOGGER_MESSAGES.TASK_FETCHED, { taskId, role, userId });
      return task;
    } catch (error) {
      logServiceError('TaskService', 'getTaskById', error, { taskId, role, userId });
      throw error;
    }
  }

  async updateTask(taskId: string, userId: string, role: string, data: UpdateTaskDto) {
    try {
      logServiceMethod('TaskService', 'updateTask', LOGGER_MESSAGES.UPDATE, { taskId, userId, role, updateData: Object.keys(data) });
      
      validateObjectInstance.validateObjectId(taskId, 'task ID');
      // TODO: Add validation middleware or manual checks for required fields if needed
      const value: UpdateTaskDto = data;
      const task = await this.checkTask(taskId);
      
      if (value.status === TASK_STATUS.IN_PROGRESS && task.blockedBy?.length) {
        const blockers = await Task.find({ _id: { $in: task.blockedBy } });
        const incomplete = blockers.filter((b) => b.status !== TASK_STATUS.COMPLETED);
        if (incomplete.length) {
          logServiceMethod('TaskService', 'updateTask', LOGGER_MESSAGES.USER_CREATION_FAILED, { taskId, blockedBy: task.blockedBy });
          throw Exceptions.BadRequest(USER_MESSAGES.BLOCKED_TASK);
        }
      }

      const assignedToId = typeof task.assignedTo === 'object' && task.assignedTo !== null
        ? String(task.assignedTo._id)
        : String(task.assignedTo);
      
      if (role !== ROLE.USER && assignedToId !== userId) {
        logServiceMethod('TaskService', 'updateTask', LOGGER_MESSAGES.TASK_FETCH_FAILED, { taskId, userId, role, assignedToId });
        throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);
      }

      const oldStatus = task.status;
      Object.assign(task, value);
      await task.updateOne(value, { runValidators: true });

      // Log activity
      if (value.status && value.status !== oldStatus) {
        await AuditUtil.logActivity(
          userId,
          'UPDATE_TASK_STATUS',
          String(task._id),
          'Task',
          `Task "${task.title}" status updated from "${oldStatus}" to "${value.status}"`
        );
      } else {
        await AuditUtil.logActivity(
          userId,
          'UPDATE_TASK',
          String(task._id),
          'Task',
          `Task "${task.title}" updated`
        );
      }

      logServiceMethod('TaskService', 'updateTask', LOGGER_MESSAGES.UPDATE, { taskId, userId, oldStatus, newStatus: value.status });
      return task;
    } catch (error) {
      logServiceError('TaskService', 'updateTask', error, { taskId, userId, role, updateData: Object.keys(data) });
      throw error;
    }
  }

  async deleteTask(taskId: string, role: string, userId: string) {
    try {
      logServiceMethod('TaskService', 'deleteTask', LOGGER_MESSAGES.DELETE, { taskId, role, userId });
      
      validateObjectInstance.validateObjectId(taskId, 'task ID');
      const task = await this.checkTask(taskId);
      
      if (role !== ROLE.ADMIN && String(task.assignedTo) !== userId) {
        logServiceMethod('TaskService', 'deleteTask', LOGGER_MESSAGES.TASK_FETCH_FAILED, { taskId, userId, role, assignedTo: task.assignedTo });
        throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);
      }
      
      await task.deleteOne();
      await AuditUtil.logActivity(
        userId,
        'DELETE_TASK',
        taskId,
        'Task',
        `Task "${task.title}" deleted`
      );
      
      logServiceMethod('TaskService', 'deleteTask', LOGGER_MESSAGES.DELETE, { taskId, userId, title: task.title });
      return { taskId };
    } catch (error) {
      logServiceError('TaskService', 'deleteTask', error, { taskId, role, userId });
      throw error;
    }
  }

  async uploadAttachments(taskId: string, files: string[], role: string, userId: string) {
    try {
      logServiceMethod('TaskService', 'uploadAttachments', LOGGER_MESSAGES.UPLOAD_ATTACHMENT, { taskId, filesCount: files.length, role, userId });
      
      validateObjectInstance.validateObjectId(taskId, 'task ID');
      const task = await this.checkTask(taskId);
      
      if (!task.attachments) task.attachments = [];
      task.attachments.push(...files);
      await task.updateOne({ attachments: task.attachments }, { runValidators: true });

      await AuditUtil.logActivity(
        userId,
        'UPLOAD_ATTACHMENT',
        String(task._id),
        'Task',
        `Attachments added to task "${task.title}"`
      );

      logServiceMethod('TaskService', 'uploadAttachments', LOGGER_MESSAGES.UPLOAD_ATTACHMENT, { taskId, userId, filesCount: files.length });
      return task;
    } catch (error) {
      logServiceError('TaskService', 'uploadAttachments', error, { taskId, filesCount: files.length, role, userId });
      throw error;
    }
  }

  async filterTasksByMonthYear(userId: string, role: string, month: number, year: number) {
    try {
      logServiceMethod('TaskService', 'filterTasksByMonthYear', LOGGER_MESSAGES.TASK_FETCHED, { userId, role, month, year });
      
      if (!Number.isInteger(month) || month < 1 || month > 12) {
        logServiceMethod('TaskService', 'filterTasksByMonthYear', LOGGER_MESSAGES.TASK_FETCH_FAILED, { month });
        throw Exceptions.BadRequest('Invalid month');
      }
      if (!Number.isInteger(year) || year < 2000 || year > 9999) {
        logServiceMethod('TaskService', 'filterTasksByMonthYear', LOGGER_MESSAGES.TASK_FETCH_FAILED, { year });
        throw Exceptions.BadRequest('Invalid year');
      }
      
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      const filter: any = { dueDate: { $gte: start, $lte: end } };
      filter.assignedTo = userId;
      
      const tasks = await Task.find(filter).populate('assignedTo createdBy ');
      
      logServiceMethod('TaskService', 'filterTasksByMonthYear', LOGGER_MESSAGES.TASK_FETCHED, { userId, role, month, year, count: tasks.length });
      return tasks;
    } catch (error) {
      logServiceError('TaskService', 'filterTasksByMonthYear', error, { userId, role, month, year });
      throw error;
    }
  }

  async getTasksByLabel(label: string, userId: string, role: string) {
    try {
      logServiceMethod('TaskService', 'getTasksByLabel', LOGGER_MESSAGES.TASK_FETCHED, { label, userId, role });
      
      if (!label || label.trim().length === 0) {
        logServiceMethod('TaskService', 'getTasksByLabel', LOGGER_MESSAGES.TASK_FETCH_FAILED, { label });
        throw Exceptions.BadRequest('Label cannot be empty');
      }
      
      const tasks = await taskQuery.findTasksByLabel(label.trim(), userId, role);
      
      logServiceMethod('TaskService', 'getTasksByLabel', LOGGER_MESSAGES.TASK_FETCHED, { label, userId, role, count: tasks.length });
      return tasks;
    } catch (error) {
      logServiceError('TaskService', 'getTasksByLabel', error, { label, userId, role });
      throw error;
    }
  }

  async checkTask(taskId: string) {
    try {
      const task = await taskQuery.findTaskById(taskId);
      if (!task) {
        logServiceMethod('TaskService', 'checkTask', LOGGER_MESSAGES.TASK_FETCH_FAILED, { taskId });
        throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);
      }
      return task;
    } catch (error) {
      logServiceError('TaskService', 'checkTask', error, { taskId });
      throw error;
    }
  }
}