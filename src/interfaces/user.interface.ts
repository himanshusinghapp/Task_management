import { Document } from 'mongoose';
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: string;
  isVerified: boolean;
  status: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateResetToken(): string;
  isLocked(): boolean;
  incrementLoginAttempts(): void;
  resetLoginAttempts(): void;
}

export interface IUserService {
  createUser(userData: any): Promise<IUser>;
  findUserById(id: string): Promise<IUser | null>;
  findUserByEmail(email: string): Promise<IUser | null>;
  updateUser(id: string, updateData: any): Promise<IUser | null>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(query: any): Promise<IUser[]>;
  searchUsers(query: string): Promise<IUser[]>;
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;
  forgotPassword(email: string): Promise<boolean>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;
  verifyUser(token: string): Promise<boolean>;
  login(email: string, password: string): Promise<{ user: IUser; token: string }>;
  logout(userId: string): Promise<boolean>;
}

export interface IUserController {
  signup(req: any, res: any, next: any): Promise<void>;
  login(req: any, res: any, next: any): Promise<void>;
  logout(req: any, res: any, next: any): Promise<void>;
  getProfile(req: any, res: any, next: any): Promise<void>;
  updateProfile(req: any, res: any, next: any): Promise<void>;
  changePassword(req: any, res: any, next: any): Promise<void>;
  forgotPassword(req: any, res: any, next: any): Promise<void>;
  resetPassword(req: any, res: any, next: any): Promise<void>;
  verifyEmail(req: any, res: any, next: any): Promise<void>;
} 