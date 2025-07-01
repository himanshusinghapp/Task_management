import { Types } from 'mongoose';
const objectId = (value: string) => {
  if (!Types.ObjectId.isValid(value)) {
    throw new Error('Must be a valid ObjectId');
  }
  return value;
};

export interface TaskIdDto {
  taskId: string;
}

export interface LabelDto {
  label: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  assignedTo?: string;
  projectId?: string;
  status?: string;
  priority?: string;
  type?: string;
  dueDate?: string;
  labels?: string[];
  blockedBy?: string[];
  estimatedHours?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  assignedTo?: string;
  projectId?: string;
  status?: string;
  priority?: string;
  type?: string;
  dueDate?: string;
  labels?: string[];
  blockedBy?: string[];
  estimatedHours?: number;
  actualHours?: number;
  isCompleted?: boolean;
}

export interface TaskQueryDto {
  status?: string;
  priority?: string;
  type?: string;
  assignedTo?: string;
  projectId?: string;
  label?: string;
  page?: number;
  limit?: number;
}

export interface TaskFilterDto {
  month: number;
  year: number;
}

export interface TaskLabelDto {
  label: string;
}

export interface UploadAttachmentsDto {
  taskId: string;
  files: string[];
}

export interface TaskPublicDto {
  _id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  projectId?: string;
  status: string;
  priority: string;
  type: string;
  dueDate?: string;
  labels?: string[];
  blockedBy?: string[];
  estimatedHours?: number;
  actualHours?: number;
  attachments?: string[];
  createdBy: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}