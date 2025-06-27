import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100, unique: true, index: true },
  description: { type: String, trim: true, maxlength: 1000 },
  members: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task', index: true }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true, index: true },
}, { timestamps: true });

projectSchema.index({ createdBy: 1, name: 1 });

export const Project = mongoose.model('Project', projectSchema);
