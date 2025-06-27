export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  password?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // Add other admin fields as needed
} 