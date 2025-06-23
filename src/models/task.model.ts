import mongoose, { Schema, Document } from 'mongoose';
import { TASK_PRIORITY, TASK_STATUS } from '../common/constants/task.constants';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TASK_STATUS;
  dueDate?: Date;
  priority: TASK_PRIORITY;
  assignedTo?: mongoose.Types.ObjectId;
  assignedBy?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  attachments?: string[];
  labels?: string[];
  blockedBy?: mongoose.Types.ObjectId[];
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true, index: true },
  description: { type: String },
  status: {
    type: String,
    enum: Object.values(TASK_STATUS),
    default: TASK_STATUS.PENDING,
    index: true,
  },
  dueDate: { type: Date, index: true },
  priority: {
    type: String,
    enum: Object.values(TASK_PRIORITY),
    default: TASK_PRIORITY.MEDIUM,
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  attachments: [{ type: String }],
  labels: [{ type: String, index: true }],
  blockedBy: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
}, { timestamps: true });

taskSchema.index({ title: 'text', description: 'text' });

export const Task = mongoose.model<ITask>('Task', taskSchema);
