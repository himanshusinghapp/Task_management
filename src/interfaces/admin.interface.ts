import { Document } from 'mongoose';
import { DTO_CONSTANTS } from '@common/constants/dto.constants';

export interface IAdmin extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  isActive: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  permissions?: string[];
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  incrementLoginAttempts(): void;
  resetLoginAttempts(): void;
}

export interface IAdminService {
  createAdmin(adminData: any): Promise<IAdmin>;
  findAdminById(id: string): Promise<IAdmin | null>;
  findAdminByEmail(email: string): Promise<IAdmin | null>;
  updateAdmin(id: string, updateData: any): Promise<IAdmin | null>;
  deleteAdmin(id: string): Promise<boolean>;
  getAllAdmins(query: any): Promise<IAdmin[]>;
  login(email: string, password: string): Promise<{ admin: IAdmin; token: string }>;
  logout(adminId: string): Promise<boolean>;
  getAllUsers(query: any): Promise<any[]>;
  blockUser(userId: string): Promise<boolean>;
  unblockUser(userId: string): Promise<boolean>;
  searchUsers(query: string): Promise<any[]>;
  getProfile(adminId: string): Promise<IAdmin | null>;
}

export interface IAdminController {
  signup(req: any, res: any, next: any): Promise<void>;
  login(req: any, res: any, next: any): Promise<void>;
  logout(req: any, res: any, next: any): Promise<void>;
  getProfile(req: any, res: any, next: any): Promise<void>;
  getAllUsers(req: any, res: any, next: any): Promise<void>;
  blockUser(req: any, res: any, next: any): Promise<void>;
  unblockUser(req: any, res: any, next: any): Promise<void>;
  searchUsers(req: any, res: any, next: any): Promise<void>;
} 