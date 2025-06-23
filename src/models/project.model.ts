import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema({
  name: { type: String, required: true, index: true },
  description: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);
