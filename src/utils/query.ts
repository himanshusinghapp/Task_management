import { User } from '@models/user.model';
import { Admin } from '@models/admin.model';
import { Task } from '@models/task.model';
import { Project } from '@models/project.model';
import { Comment } from '@models/comment.model';
import { Exceptions } from '@common/exception/customException';
import { USER_MESSAGES } from '@common/constants/userMessage';

// Helper to wrap queries with error handling
async function safeQuery<T>(fn: () => Promise<T>, errorMsg = 'Database error'): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    throw Exceptions.InternalServerError(errorMsg);
  }
}

// User queries
class UserQuery {
  async findUserByEmail(email: string) {
    return safeQuery(() => User.findOne({ email }), USER_MESSAGES.USER_SEARCH_ERROR);
  }
  async findUserById(id: string) {
    return safeQuery(() => User.findById(id), USER_MESSAGES.USER_FETCH_SUCCESS);
  }
  async updateUserById(id: string, update: any) {
    return safeQuery(() => User.updateOne({ _id: id }, update), USER_MESSAGES.USER_PROFILE_UPDATE_ERROR);
  }
}

// Admin queries
class AdminQuery {
  async findAdminByEmail(email: string) {
    return safeQuery(() => Admin.findOne({ email }), USER_MESSAGES.USER_SEARCH_ERROR);
  }
  async findAdminById(id: string) {
    return safeQuery(() => Admin.findById(id).lean(), USER_MESSAGES.ADMIN_NOT_FOUND);
  }
  async updateAdminById(id: string, data: Partial<typeof Admin>) {
    return safeQuery(() => Admin.updateOne({ _id: id }, { $set: data }), USER_MESSAGES.ADMIN_UPDATED);
  }
  async findUsers() {
    return safeQuery(() => User.find().select('-password'), USER_MESSAGES.USER_SEARCH_ERROR);
  }
}

// Task queries
class TaskQuery {
  async findTaskById(id: string) {
    return safeQuery(() => Task.findById(id).populate('assignedTo createdBy'), USER_MESSAGES.TASK_QUERY_ERROR);
  }
  async findTasksByUser(userId: string) {
    return safeQuery(() => Task.find({ assignedTo: userId }).populate('assignedTo createdBy'), USER_MESSAGES.TASK_QUERY_ERROR);
  }
  findAllTasks(role: string, userId: string) {
    return safeQuery(() => Task.find(role === 'admin' ? {} : { assignedTo: userId }).populate('assignedTo createdBy'), USER_MESSAGES.TASK_QUERY_ERROR);
  }
  async findTasksByLabel(label: string, userId: string, role: string) {
    const filter: any = { labels: label };
    if (role !== 'admin') filter.assignedTo = userId;
    return safeQuery(() => Task.find(filter).populate('assignedTo createdBy'), USER_MESSAGES.TASK_QUERY_ERROR);
  }
  async findTasksByMonthYear(month: number, year: number, userId: string, role: string) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    const filter: any = { dueDate: { $gte: start, $lte: end } };
    if (role !== 'admin') filter.assignedTo = userId;
    return safeQuery(() => Task.find(filter).populate('assignedTo createdBy'), USER_MESSAGES.TASK_QUERY_ERROR);
  }
  async findAllTasksPaginated(role: string, userId: string, skip: number, limit: number) {
    return safeQuery(
      () => Task.find(role === 'admin' ? {} : { assignedTo: userId })
        .populate('assignedTo createdBy')
        .skip(skip)
        .limit(limit),
      USER_MESSAGES.TASK_QUERY_ERROR
    );
  }
}

// Project queries
class ProjectQuery {
  async findProjectById(projectId: string) {
    return safeQuery(() => Project.findById(projectId), USER_MESSAGES.PROJECT_QUERY_ERROR);
  }
  async getAllProjects() {
    return safeQuery(() => Project.find().populate('members createdBy').lean(), USER_MESSAGES.PROJECT_QUERY_ERROR);
  }
  async getProjectsByUserId(userId: string) {
    return safeQuery(() => Project.find({ members: userId }).populate('members createdBy'), USER_MESSAGES.PROJECT_QUERY_ERROR);
  }
  async findProjectandUpdate(projectId: string, update: any) {
    return safeQuery(() => Project.findByIdAndUpdate(
      projectId,
      update,
      { new: true, runValidators: true }
    ).lean(), USER_MESSAGES.PROJECT_QUERY_ERROR);
  }
  async deleteProjectById(projectId: string) {
    return safeQuery(() => Project.findByIdAndDelete(projectId).lean(), USER_MESSAGES.PROJECT_QUERY_ERROR);
  }
}

// Comment queries
class CommentQuery {
  async create(data: any) {
    return safeQuery(() => Comment.create(data), USER_MESSAGES.COMMENT_QUERY_ERROR);
  }
  async findByTask(taskId: string) {
    return safeQuery(() => Comment.find({ taskId }).sort({ createdAt: 1 }).populate('createdBy'), USER_MESSAGES.COMMENT_QUERY_ERROR);
  }
  async findById(id: string) {
    return safeQuery(() => Comment.findById(id).populate('createdBy'), USER_MESSAGES.COMMENT_QUERY_ERROR);
  }
  async findAll() {
    return safeQuery(() => Comment.find().populate('createdBy'), USER_MESSAGES.COMMENT_QUERY_ERROR);
  }
  async findByUser(userId: string) {
    return safeQuery(() => Comment.find({ createdBy: userId }).populate('createdBy'), USER_MESSAGES.COMMENT_QUERY_ERROR);
  }
  async findByTaskAndUser(taskId: string, userId: string) {
    return safeQuery(() => Comment.find({ taskId, createdBy: userId }).populate('createdBy'), USER_MESSAGES.COMMENT_QUERY_ERROR);
  }
}

// Export singletons for easy import
export const userQuery = new UserQuery();
export const adminQuery = new AdminQuery();
export const taskQuery = new TaskQuery();
export const projectQuery = new ProjectQuery();
export const commentQuery = new CommentQuery();