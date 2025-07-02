import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { Admin } from '../src/models/admin.model';
import { hashPassword } from '../src/common/helpers/hash';
import { USER_MESSAGES } from '@/common/constants';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI!;

async function seedAdmin() {
  await mongoose.connect(MONGO_URI);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(USER_MESSAGES.PASSWORD_EMAIL_IN_ENV);
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(USER_MESSAGES.ADMIN_EXISTS);
    process.exit(0);
  }

  const hashed = await hashPassword(password);
  await Admin.create({
    name: process.env.ADMIN_NAME,
    email,
    password: hashed,
    isActive: true,
  });

  console.log(USER_MESSAGES.ADMIN_SEED);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
}); 