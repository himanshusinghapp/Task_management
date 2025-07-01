
export interface CreateProjectDto {
  name: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  createdBy?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
}

export interface ProjectIdDto {
  projectId: string;
}

export interface ProjectQueryDto {
  status?: string;
  createdBy?: string;
  page?: number;
  limit?: number;
}

export interface AssignMembersDto {
  projectId: string;
  memberIds: string[];
}

export interface RemoveMembersDto {
  projectId: string;
  memberIds: string[];
}

export interface AssignTasksDto {
  projectId: string;
  taskIds: string[];
}


export interface RemoveTasksDto {
  projectId: string;
  taskIds: string[];
}

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