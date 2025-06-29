import { Types } from 'mongoose';
import { DTO_CONSTANTS } from '@common/constants/dto.constants';

// Custom validator for MongoDB ObjectId
const objectId = (value: string) => {
  if (!Types.ObjectId.isValid(value)) {
    throw new Error('Must be a valid ObjectId');
  }
  return value;
};

// Task DTOs (no Joi)
export interface TaskIdDto {
  taskId: string;
}

export interface LabelDto {
  label: string;
}

// Create Task DTO
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
  assignedBy?: string;
}

// Update Task DTO
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

// Task Query DTO
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

// Task Filter by Month/Year DTO
export interface TaskFilterDto {
  month: number;
  year: number;
}

// Task Label DTO
export interface TaskLabelDto {
  label: string;
}

// Upload Attachments DTO
export interface UploadAttachmentsDto {
  taskId: string;
  files: string[];
}

// Task Public DTO (for responses)
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
  assignedBy?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}