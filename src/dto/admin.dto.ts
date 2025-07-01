export interface CreateAdminDto {
  name: string;
  email: string;
  password: string;
}

// Admin Login DTO
export interface LoginAdminDto {
  email: string;
  password: string;
}

// Admin Update DTO
export interface UpdateAdminDto {
  name?: string;
  email?: string;
  status?: string;
}

// Admin ID DTO
export interface AdminIdDto {
  adminId: string;
}

// User Block/Unblock DTO
export interface BlockUserDto {
  userId: string;
}

// Search Query DTO
export interface SearchQueryDto {
  query?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// Admin Public DTO (for responses)
export interface AdminPublicDto {
  _id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}