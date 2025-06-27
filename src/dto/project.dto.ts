// Project DTOs (no Joi)
export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}

export interface AssignMembersDto {
  memberIds: string[];
}

export interface RemoveMembersDto {
  memberIds: string[];
}

export interface AssignTasksDto {
  taskIds: string[];
}

export interface RemoveTasksDto {
  taskIds: string[];
}

export interface ProjectIdDto {
  projectId: string;
} 