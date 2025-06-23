import { logActivity } from '@utils/audit.util';
import { USER_MESSAGES } from '@common/constants/userMessage';
import { Exceptions } from '@common/exception/customException';
import { findTaskById, findAllTasks, findTasksByLabel } from '@utils/query';
import { Task } from '@models/task.model';
import { createTaskDto, updateTaskDto } from '@dto/task.dto';
import { validateObjectId } from '@common/helpers/validateObjectId';
import { getPagination } from '@common/helpers/pagination';
import { validateObjectIdArray } from '@common/helpers/validateObjectIdArray';

export class TaskService {
  async createTask(data: any, createdBy: string, role: string) {
    if (role !== 'admin') {
      throw Exceptions.Forbidden(USER_MESSAGES.ADMIN_ONLY_ASSIGN);
    }

    const { error, value } = createTaskDto.validate(data, { abortEarly: false });
    if (error) {
      throw Exceptions.BadRequest(error.details.map((e) => e.message).join(', '));
    }
    value.assignedBy = createdBy;

    if (value.blockedBy?.length) {
      if (value.blockedBy.some((id: string) => id === value._id)) {
        throw Exceptions.BadRequest('A task cannot block itself.');
      }
      validateObjectIdArray(value.blockedBy, 'blockedBy');
      const blockers = await Task.find({ _id: { $in: value.blockedBy } });
      if (blockers.length !== value.blockedBy.length) {
        throw Exceptions.BadRequest(USER_MESSAGES.INVALID_BLOCKED_BY);
      }
      const cycle = blockers.some((blocker) => blocker.blockedBy?.includes(value._id));
      if (cycle) {
        throw Exceptions.BadRequest('Cyclic dependency detected in blockedBy.');
      }
    }

    try {
      const task = await Task.create({ ...value, createdBy });
      await logActivity(
        createdBy,
        'CREATE_TASK',
        String(task._id),
        'Task',
        `Task "${task.title}" created by admin`
      );
      const populatedTask = await Task.findById(task._id)
        .populate('blockedBy assignedTo assignedBy');
      return populatedTask;
    } catch (err) {
      throw Exceptions.InternalServerError(USER_MESSAGES.TASK_CREATE_FAILED);
    }
  }

  async getAllTasks(role: string, userId: string, query: any = {}) {
    const { skip, limit } = getPagination(query);
    return await findAllTasks(role, userId).skip(skip).limit(limit);
  }

  async getTaskById(taskId: string, role: string, userId: string) {
    validateObjectId(taskId, 'task ID');
    const task = await findTaskById(taskId);
    if (!task) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);
    const assignedToId = typeof task.assignedTo === 'object' && task.assignedTo !== null
      ? String(task.assignedTo._id)
      : String(task.assignedTo);
    if (role !== 'admin' && assignedToId !== userId) {
      throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);
    }
    return task;
  }

  async updateTask(taskId: string, userId: string, role: string, data: any) {
    validateObjectId(taskId, 'task ID');
    const { error, value } = updateTaskDto.validate(data, { abortEarly: false });
    if (error) {
      throw Exceptions.BadRequest(error.details.map((e) => e.message).join(', '));
    }

    const task = await findTaskById(taskId);
    if (!task) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);

    if (role !== 'admin' && value.assignedTo) {
      throw Exceptions.Forbidden(USER_MESSAGES.ADMIN_ONLY_ASSIGN);
    }
    if (value.status === 'in-progress' && task.blockedBy?.length) {
      const blockers = await Task.find({ _id: { $in: task.blockedBy } });
      const incomplete = blockers.filter((b) => b.status !== 'completed');
      if (incomplete.length) {
        throw Exceptions.BadRequest(USER_MESSAGES.BLOCKED_TASK);
      }
    }

    const assignedToId = typeof task.assignedTo === 'object' && task.assignedTo !== null
      ? String(task.assignedTo._id)
      : String(task.assignedTo);
    if (role !== 'admin' && assignedToId !== userId) {
      throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);
    }

    const oldStatus = task.status;
    Object.assign(task, value);
    await task.save();

    // Log activity
    if (value.status && value.status !== oldStatus) {
      await logActivity(
        userId,
        'UPDATE_TASK_STATUS',
        String(task._id),
        'Task',
        `Task "${task.title}" status updated from "${oldStatus}" to "${value.status}"`
      );
    } else {
      await logActivity(
        userId,
        'UPDATE_TASK',
        String(task._id),
        'Task',
        `Task "${task.title}" updated`
      );
    }

    return task;
  }

  async deleteTask(taskId: string, role: string, userId: string) {
    validateObjectId(taskId, 'task ID');
    const task = await findTaskById(taskId);
    if (!task) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);
    if (role !== 'admin' && String(task.assignedTo) !== userId) {
      throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);
    }
    await task.deleteOne();
    await logActivity(
      userId,
      'DELETE_TASK',
      taskId,
      'Task',
      `Task "${task.title}" deleted`
    );
    return { taskId };
  }

  async uploadAttachments(taskId: string, files: string[], role: string, userId: string) {
    validateObjectId(taskId, 'task ID');
    const task = await findTaskById(taskId);
    if (!task) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);
    if (role !== 'admin' && String(task.assignedTo) !== userId) {
      throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);
    }
    if (!task.attachments) task.attachments = [];
    task.attachments.push(...files);
    await task.save();

    await logActivity(
      userId,
      'UPLOAD_ATTACHMENT',
      String(task._id),
      'Task',
      `Attachments added to task "${task.title}"`
    );

    return task;
  }

  async filterTasksByMonthYear(userId: string, role: string, month: number, year: number) {
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw Exceptions.BadRequest('Invalid month');
    }
    if (!Number.isInteger(year) || year < 2000 || year > 9999) {
      throw Exceptions.BadRequest('Invalid year');
    }
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    const filter: any = { dueDate: { $gte: start, $lte: end } };
    if (role !== 'admin') filter.assignedTo = userId;
    return await Task.find(filter).populate('assignedTo createdBy assignedBy');
  }

  async getTasksByLabel(label: string, userId: string, role: string) {
    if (!label || label.trim().length === 0) {
      throw Exceptions.BadRequest('Label cannot be empty');
    }
    return await findTasksByLabel(label.trim(), userId, role);
  }
}