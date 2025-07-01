export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  isVerified?: boolean;
  status?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserQueryDto {
  query?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface UserIdDto {
  userId: string;
}

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