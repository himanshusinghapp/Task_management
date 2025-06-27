import { Types } from 'mongoose';

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

export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
  assignedBy?: string;
  labels?: string[];
  blockedBy?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  labels?: string[];
  blockedBy?: string[];
}