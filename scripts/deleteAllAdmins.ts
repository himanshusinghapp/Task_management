import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { Admin } from '../src/models/admin.model';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI!;

async function deleteAllAdmins() {
  await mongoose.connect(MONGO_URI);
  const result = await Admin.deleteMany({});
  console.log(`Deleted ${result.deletedCount} admin(s)`);
  process.exit(0);
}

deleteAllAdmins().catch((err) => {
  console.error(err);
  process.exit(1);
}); 