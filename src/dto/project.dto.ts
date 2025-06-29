import { DTO_CONSTANTS } from '@common/constants/dto.constants';

// Create Project DTO
export interface CreateProjectDto {
  name: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  createdBy?: string;
}

// Update Project DTO
export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
}

// Project ID DTO
export interface ProjectIdDto {
  projectId: string;
}

// Project Query DTO
export interface ProjectQueryDto {
  status?: string;
  createdBy?: string;
  page?: number;
  limit?: number;
}

// Assign Members DTO
export interface AssignMembersDto {
  projectId: string;
  memberIds: string[];
}

// Remove Members DTO
export interface RemoveMembersDto {
  projectId: string;
  memberIds: string[];
}

// Assign Tasks DTO
export interface AssignTasksDto {
  projectId: string;
  taskIds: string[];
}

// Remove Tasks DTO
export interface RemoveTasksDto {
  projectId: string;
  taskIds: string[];
}

// Project Public DTO (for responses)
export interface ProjectPublicDto {
  _id: string;
  name: string;
  description?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  createdBy: string;
  members?: string[];
  tasks?: string[];
  createdAt: string;
  updatedAt: string;
} 