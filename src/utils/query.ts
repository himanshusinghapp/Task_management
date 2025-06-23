import { User } from '../models/user.model';
import { Admin } from '../models/admin.model';
import { Task } from '../models/task.model';
import { Project } from '../models/project.model';
import { Comment } from '../models/comment.model';

export const findUserByEmail = async (email: string) => User.findOne({ email });
export const findUserById = async (id: string) => User.findById(id);
export const updateUserById = async (id: string, update: any) => User.updateOne({ _id: id }, update);

export const findAdminByEmail = async (email: string) => {
  return await Admin.findOne({ email });
};

export const findAdminById = async (id: string) => {
  return await Admin.findById(id);
};

export const updateAdminById = async (id: string, data: Partial<typeof Admin>) => {
  return await Admin.updateOne({ _id: id }, { $set: data });
};

export const findUsers = async () => {
  return await User.find().select('-password');
};

export const findTaskById = async (id: string) => Task.findById(id).populate('assignedTo createdBy');

export const findTasksByUser = async (userId: string) =>
  Task.find({ assignedTo: userId }).populate('assignedTo createdBy');

export const findAllTasks = async (role: string, userId: string) =>
  Task.find({ assignedTo: userId }).populate('assignedTo createdBy').populate('assignedTo createdBy');;

export const findTasksByLabel = async (label: string, userId: string, role: string) => {
  const filter: any = { labels: label };
  if (role !== 'admin') filter.assignedTo = userId;
  return Task.find(filter).populate('assignedTo createdBy');
};

export const findTasksByMonthYear = async (month: number, year: number, userId: string, role: string) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);
  const filter: any = { dueDate: { $gte: start, $lte: end } };
  if (role !== 'admin') filter.assignedTo = userId;
  return Task.find(filter).populate('assignedTo createdBy');
};



export const findProjectById = async (projectId: string) => {
  return await Project.findById(projectId);
};

export const getAllProjects = async () => {
  return await Project.find().populate('members createdBy');
};

export const getProjectsByUserId = async (userId: string) => {
  return await Project.find({ members: userId }).populate('members createdBy');
};


export const CommentQuery = {
  create: async (data: any) => await Comment.create(data),
  findByTask: async (taskId: string) =>
    await Comment.find({ taskId }).sort({ createdAt: 1 }).populate('createdBy'),
  findById: async (id: string) => await Comment.findById(id).populate('createdBy'),
  findAll: async () => await Comment.find().populate('createdBy'),
  findByUser: async (userId: string) =>
    await Comment.find({ createdBy: userId }).populate('createdBy'),
  findByTaskAndUser: async (taskId: string, userId: string) =>
    await Comment.find({ taskId, createdBy: userId }).populate('createdBy'),
};