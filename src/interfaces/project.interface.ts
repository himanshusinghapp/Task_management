import { Document } from 'mongoose';

export interface IProject extends Document {
  _id: string;
  name: string;
  description?: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  createdBy: string;
  members?: string[];
  tasks?: string[];
  createdAt: Date;
  updatedAt: Date;

  // Methods
  isOverdue(): boolean;
  isCompleted(): boolean;
  isActive(): boolean;
  calculateProgress(): number;
  addMember(memberId: string): void;
  removeMember(memberId: string): void;
  addTask(taskId: string): void;
  removeTask(taskId: string): void;
}

export interface IProjectService {
  createProject(projectData: any, createdBy: string, role: string): Promise<IProject>;
  findProjectById(id: string): Promise<IProject | null>;
  updateProject(id: string, updateData: any, userId: string, role: string): Promise<IProject | null>;
  deleteProject(id: string, role: string, userId: string): Promise<boolean>;
  getAllProjects(role: string, userId: string, query: any): Promise<IProject[]>;
  getProjectsByStatus(status: string, userId: string, role: string): Promise<IProject[]>;
  getProjectsByUser(userId: string, role: string): Promise<IProject[]>;
  assignMembers(projectId: string, memberIds: string[], assignedBy: string): Promise<IProject>;
  removeMembers(projectId: string, memberIds: string[], removedBy: string): Promise<IProject>;
  assignTasks(projectId: string, taskIds: string[], assignedBy: string): Promise<IProject>;
  removeTasks(projectId: string, taskIds: string[], removedBy: string): Promise<IProject>;
  getProjectProgress(projectId: string): Promise<number>;
  getProjectMembers(projectId: string): Promise<any[]>;
  getProjectTasks(projectId: string): Promise<any[]>;
}

export interface IProjectController {
  createProject(req: any, res: any, next: any): Promise<void>;
  getProjectById(req: any, res: any, next: any): Promise<void>;
  getAllProjects(req: any, res: any, next: any): Promise<void>;
  updateProject(req: any, res: any, next: any): Promise<void>;
  deleteProject(req: any, res: any, next: any): Promise<void>;
  assignMembers(req: any, res: any, next: any): Promise<void>;
  removeMembers(req: any, res: any, next: any): Promise<void>;
  assignTasks(req: any, res: any, next: any): Promise<void>;
  removeTasks(req: any, res: any, next: any): Promise<void>;
  getProjectProgress(req: any, res: any, next: any): Promise<void>;
  getProjectMembers(req: any, res: any, next: any): Promise<void>;
  getProjectTasks(req: any, res: any, next: any): Promise<void>;
} 