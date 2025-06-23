// import { logActivity } from '../utils/audit.util';
// import { USER_MESSAGES } from '../common/constants/userMessage';
// import { Exceptions } from '../common/customException';
// import { findTaskById, findAllTasks, findTasksByLabel } from '../utils/query';
// import { Task } from '../models/task.model';

// export class TaskService {
//   async createTask(data: any, createdBy: string) {
//     try {
//       const task = await Task.create({ ...data, createdBy });
//       await logActivity(createdBy, 'CREATE_TASK', (task._id as any).toString(), 'Task', `Task "${task.title}" created`);
//       return task;
//     } catch (err) {
//       throw Exceptions.InternalServerError(USER_MESSAGES.TASK_CREATE_FAILED);
//     }
//   }

//   async getAllTasks(role: string, userId: string) {
//     return await findAllTasks(role, userId);
//   }

//   async getTaskById(taskId: string, role: string, userId: string) {
//     const task = await findTaskById(taskId);
//     if (!task) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);
//     if (role !== 'admin' && String(task.assignedTo) !== userId)
//       throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);
//     return task;
//   }

// async updateTask(taskId: string, userId: string, role: string, data: any) {
//   const task = await findTaskById(taskId);
//   if (!task) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);

//   if (data.status === 'in-progress' && task.blockedBy?.length) {
//     const blockers = await Task.find({ _id: { $in: task.blockedBy } });
//     const incomplete = blockers.filter(b => b.status !== 'completed');
//     if (incomplete.length) throw Exceptions.BadRequest(USER_MESSAGES.BLOCKED_TASK);
//   }

//   if (role !== 'admin' && String(task.assignedTo) !== userId)
//     throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);

//   const oldStatus = task.status;
//   Object.assign(task, data);
//   await task.save();

//   if (data.status && data.status !== oldStatus) {
//     await logActivity(
//       userId,
//       'UPDATE_TASK_STATUS',
//       String(task._id),
//       'Task',
//       `Task status updated from "${oldStatus}" to "${data.status}"`
//     );
//   } else {
//     await logActivity(
//       userId,
//       'UPDATE_TASK',
//       String(task._id),
//       'Task',
//       `Task "${task.title}" updated`
//     );
//   }

//   return task;
// }

//   async deleteTask(taskId: string, role: string, userId: string) {
//     const task = await findTaskById(taskId);
//     if (!task) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);
//     if (role !== 'admin' && String(task.assignedTo) !== userId)
//       throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);
//     await task.deleteOne();
//     return { message: USER_MESSAGES.TASK_DELETED };
//   }

//   async uploadAttachments(taskId: string, files: string[], role: string, userId: string) {
//     const task = await findTaskById(taskId);
//     if (!task) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);
//     if (role !== 'admin' && String(task.assignedTo) !== userId)
//       throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);
//     if (!task.attachments) {
//       task.attachments = [];
//     }
//     task.attachments.push(...files);
//     await task.save();
//     return task;
//   }

//   async filterTasksByMonthYear(userId: string, role: string, month: number, year: number) {
//     const start = new Date(year, month - 1, 1);
//     const end = new Date(year, month, 0, 23, 59, 59);
//     const filter: any = { dueDate: { $gte: start, $lte: end } };
//     if (role !== 'admin') filter.assignedTo = userId;
//     return await Task.find(filter).populate('assignedTo createdBy');
//   }

//   async getTasksByLabel(label: string, userId: string, role: string) {
//     return await findTasksByLabel(label, userId, role);
//   }
// }
import { logActivity } from '../utils/audit.util';
import { USER_MESSAGES } from '../common/constants/userMessage';
import { Exceptions } from '../common/customException';
import { findTaskById, findAllTasks, findTasksByLabel } from '../utils/query';
import { Task } from '../models/task.model';
import { createTaskDto, updateTaskDto } from '../dto/task.dto';
import { Types } from 'mongoose';

export class TaskService {
  async createTask(data: any, createdBy: string, role: string) {
    if (role !== 'admin') {
      throw Exceptions.Forbidden(USER_MESSAGES.ADMIN_ONLY_ASSIGN);
    }

    // Validate DTO
    const { error, value } = createTaskDto.validate(data, { abortEarly: false });
    if (error) {
      throw Exceptions.BadRequest(error.details.map((e) => e.message).join(', '));
    }

    // Ensure assignedBy is the admin creating the task
    value.assignedBy = createdBy;

    // Enhanced blockedBy validation
    if (value.blockedBy?.length) {
      // Check for self-reference
      if (value.blockedBy.some((id: string) => id === value._id)) {
        throw Exceptions.BadRequest('A task cannot block itself.');
      }
      // Check all IDs are valid ObjectIds
      if (!value.blockedBy.every((id: string) => Types.ObjectId.isValid(id))) {
        throw Exceptions.BadRequest('One or more blockedBy IDs are invalid.');
      }
      // Check all tasks exist
      const blockers = await Task.find({ _id: { $in: value.blockedBy } });
      if (blockers.length !== value.blockedBy.length) {
        throw Exceptions.BadRequest(USER_MESSAGES.INVALID_BLOCKED_BY);
      }
      // Optional: Check for cycles (simple check: ensure none of the blockers are blocked by this task)
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
      // Populate relationships for response
      const populatedTask = await Task.findById(task._id)
        .populate('blockedBy assignedTo assignedBy');
      return {
        message: USER_MESSAGES.TASK_CREATED,
        task: populatedTask,
      };
    } catch (err) {
      throw Exceptions.InternalServerError(USER_MESSAGES.TASK_CREATE_FAILED);
    }
  }

  async getAllTasks(role: string, userId: string) {
    return await findAllTasks(role, userId);
  }

  async getTaskById(taskId: string, role: string, userId: string) {
    if (!Types.ObjectId.isValid(taskId)) {
      throw Exceptions.BadRequest('Invalid task ID');
    }
    const task = await findTaskById(taskId);
    if (!task) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);
    // Fix: handle both populated and unpopulated assignedTo
    const assignedToId = typeof task.assignedTo === 'object' && task.assignedTo !== null
      ? String(task.assignedTo._id)
      : String(task.assignedTo);
    if (role !== 'admin' && assignedToId !== userId) {
      throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);
    }
    return task;
  }

  async updateTask(taskId: string, userId: string, role: string, data: any) {
    if (!Types.ObjectId.isValid(taskId)) {
      throw Exceptions.BadRequest('Invalid task ID');
    }

    // Validate DTO
    const { error, value } = updateTaskDto.validate(data, { abortEarly: false });
    if (error) {
      throw Exceptions.BadRequest(error.details.map((e) => e.message).join(', '));
    }

    const task = await findTaskById(taskId);
    if (!task) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);

    // Prevent non-admins from changing assignedTo
    if (role !== 'admin' && value.assignedTo) {
      throw Exceptions.Forbidden(USER_MESSAGES.ADMIN_ONLY_ASSIGN);
    }

    // Check if task is blocked
    if (value.status === 'in-progress' && task.blockedBy?.length) {
      const blockers = await Task.find({ _id: { $in: task.blockedBy } });
      const incomplete = blockers.filter((b) => b.status !== 'completed');
      if (incomplete.length) {
        throw Exceptions.BadRequest(USER_MESSAGES.BLOCKED_TASK);
      }
    }

    // Access control
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
    if (!Types.ObjectId.isValid(taskId)) {
      throw Exceptions.BadRequest('Invalid task ID');
    }
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
    return { message: USER_MESSAGES.TASK_DELETED };
  }

  async uploadAttachments(taskId: string, files: string[], role: string, userId: string) {
    if (!Types.ObjectId.isValid(taskId)) {
      throw Exceptions.BadRequest('Invalid task ID');
    }
    const task = await findTaskById(taskId);
    if (!task) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);
    const assignedToId = typeof task.assignedTo === 'object' && task.assignedTo !== null
    ? String(task.assignedTo._id)
    : String(task.assignedTo);
  if (role !== 'admin' && assignedToId !== userId) {
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