import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

commentSchema.index({ taskId: 1, createdBy: 1 });

export const Comment = mongoose.model('Comment', commentSchema);