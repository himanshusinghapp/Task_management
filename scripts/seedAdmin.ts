import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import path from 'path';
import dotenv from 'dotenv';
import { Admin } from '../src/models/admin.model';
import { hashPassword } from '../src/common/helpers/hash';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI!;

async function seedAdmin() {
  await mongoose.connect(MONGO_URI);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables.');
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashed = await hashPassword(password);
  await Admin.create({
    name: 'Super Admin',
    email,
    password: hashed,
    isActive: true,
  });

  console.log('Admin seeded successfully');
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
}); 