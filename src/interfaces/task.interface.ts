import { Document } from 'mongoose';
import { DTO_CONSTANTS } from '@common/constants/dto.constants';

export interface ITask extends Document {
  _id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  projectId?: string;
  status: string;
  priority: string;
  type: string;
  dueDate?: Date;
  labels?: string[];
  blockedBy?: string[];
  estimatedHours?: number;
  actualHours?: number;
  attachments?: string[];
  createdBy: string;
  assignedBy?: string;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  isOverdue(): boolean;
  isBlocked(): boolean;
  canStart(): boolean;
  markAsCompleted(): void;
  addAttachment(filePath: string): void;
  removeAttachment(filePath: string): void;
}

export interface ITaskService {
  createTask(taskData: any, createdBy: string, role: string): Promise<ITask>;
  findTaskById(id: string): Promise<ITask | null>;
  updateTask(id: string, updateData: any, userId: string, role: string): Promise<ITask | null>;
  deleteTask(id: string, role: string, userId: string): Promise<boolean>;
  getAllTasks(role: string, userId: string, query: any): Promise<ITask[]>;
  getTasksByProject(projectId: string, userId: string, role: string): Promise<ITask[]>;
  getTasksByUser(userId: string, role: string): Promise<ITask[]>;
  getTasksByStatus(status: string, userId: string, role: string): Promise<ITask[]>;
  getTasksByPriority(priority: string, userId: string, role: string): Promise<ITask[]>;
  getTasksByLabel(label: string, userId: string, role: string): Promise<ITask[]>;
  filterTasksByMonthYear(userId: string, role: string, month: number, year: number): Promise<ITask[]>;
  uploadAttachments(taskId: string, files: string[], role: string, userId: string): Promise<ITask>;
  assignTask(taskId: string, assignedTo: string, assignedBy: string): Promise<ITask>;
  unassignTask(taskId: string, userId: string, role: string): Promise<ITask>;
}

export interface ITaskController {
  createTask(req: any, res: any, next: any): Promise<void>;
  getTaskById(req: any, res: any, next: any): Promise<void>;
  getAllTasks(req: any, res: any, next: any): Promise<void>;
  updateTask(req: any, res: any, next: any): Promise<void>;
  deleteTask(req: any, res: any, next: any): Promise<void>;
  uploadAttachments(req: any, res: any, next: any): Promise<void>;
  filterTasksByMonthYear(req: any, res: any, next: any): Promise<void>;
  getTasksByLabel(req: any, res: any, next: any): Promise<void>;
  assignTask(req: any, res: any, next: any): Promise<void>;
  unassignTask(req: any, res: any, next: any): Promise<void>;
} 