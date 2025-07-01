import { DTO_CONSTANTS } from '@common/constants/dto.constants';

// User Registration DTO
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: string;
}

// User Login DTO
export interface LoginUserDto {
  email: string;
  password: string;
}

// User Update DTO
export interface UpdateUserDto {
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  isVerified?: boolean;
  status?: string;
}

// Change Password DTO
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Forgot Password DTO
export interface ForgotPasswordDto {
  email: string;
}

// Reset Password DTO
export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// User Query DTO
export interface UserQueryDto {
  query?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// User ID DTO
export interface UserIdDto {
  userId: string;
}

// User Public DTO (for responses)
export interface UserPublicDto {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  isVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
} 