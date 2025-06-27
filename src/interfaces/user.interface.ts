export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  isActive?: boolean;
  isVerified?: boolean;
  phoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Add other user fields as needed
} 