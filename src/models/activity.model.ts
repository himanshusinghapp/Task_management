// models/activity.model.ts
import mongoose, { Schema } from 'mongoose';

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  targetId: { type: Schema.Types.ObjectId },
  targetType: { type: String }, // e.g., Task, Comment
  message: { type: String },
}, { timestamps: true });

export const Activity = mongoose.model('Activity', activitySchema);
