import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema)