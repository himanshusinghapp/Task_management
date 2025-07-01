import mongoose from 'mongoose';
import {logServiceMethod, logServiceError ,projectQuery,AuditUtil} from '@utils';
import { LOGGER_MESSAGES,USER_MESSAGES } from '@common/constants';
import { Exceptions } from '@common/exception'
import { Project } from '@models';
import { CreateProjectDto, UpdateProjectDto, AssignMembersDto, RemoveMembersDto, AssignTasksDto, RemoveTasksDto } from '@dto';
import { validateObject,validateObjectIdArray } from '@common/helpers';

const validateObjectInstance = new validateObject();

export class ProjectService {
  async createProject(data: CreateProjectDto, createdBy: string, role: string) {
    try {
      logServiceMethod('ProjectService', 'createProject', LOGGER_MESSAGES.CREATE, { createdBy, role, name: data.name });
      
      if (role !== 'admin') {
        logServiceMethod('ProjectService', 'createProject', LOGGER_MESSAGES.USER_CREATION_FAILED, { createdBy, role });
        throw Exceptions.Forbidden(USER_MESSAGES.ADMIN_ONLY_ASSIGN);
      }

      const project = await Project.create({ ...data, createdBy });
      await AuditUtil.logActivity(
        createdBy,
        'CREATE_PROJECT',
        String(project._id),
        'Project',
        `Project "${project.name}" created by admin`
      );

      logServiceMethod('ProjectService', 'createProject', LOGGER_MESSAGES.CREATE, { projectId: project._id, createdBy, name: project.name });
      return project;
    } catch (error) {
      logServiceError('ProjectService', 'createProject', error, { createdBy, role, name: data.name });
      throw error;
    }
  }

  async getAllProjects(role: string, userId: string, query: any = {}) {
    try {
      logServiceMethod('ProjectService', 'getAllProjects', LOGGER_MESSAGES.PROJECT_CREATED, { role, userId, query });
      const projects = await projectQuery.getAllProjects();
      logServiceMethod('ProjectService', 'getAllProjects', LOGGER_MESSAGES.PROJECT_CREATED, { role, userId, count: projects.length });
      return projects;
    } catch (error) {
      logServiceError('ProjectService', 'getAllProjects', error, { role, userId, query });
      throw error;
    }
  }

  async getProjectById(projectId: string, role: string, userId: string) {
    try {
      logServiceMethod('ProjectService', 'getProjectById', LOGGER_MESSAGES.PROJECT_CREATED, { projectId, role, userId });
      validateObjectInstance.validateObjectId(projectId, 'project ID');
      const project = await this.checkProject(projectId);
      this.checkAdminOrOwner(project, userId, role);
      logServiceMethod('ProjectService', 'getProjectById', LOGGER_MESSAGES.PROJECT_CREATED, { projectId, role, userId });
      return project;
    } catch (error) {
      logServiceError('ProjectService', 'getProjectById', error, { projectId, role, userId });
      throw error;
    }
  }

  async updateProject(projectId: string, userId: string, role: string, data: UpdateProjectDto) {
    try {
      logServiceMethod('ProjectService', 'updateProject', LOGGER_MESSAGES.PROJECT_CREATED, { projectId, userId, role, updateData: Object.keys(data) });
      validateObjectInstance.validateObjectId(projectId, 'project ID');
      const project = await this.checkProject(projectId);
      this.checkAdminOrOwner(project, userId, role);
      Object.assign(project, data);
      await project.updateOne(data, { runValidators: true });
      await AuditUtil.logActivity(
        userId,
        'UPDATE_PROJECT',
        String(project._id),
        'Project',
        `Project "${project.name}" updated`
      );
      logServiceMethod('ProjectService', 'updateProject', LOGGER_MESSAGES.PROJECT_CREATED, { projectId, userId, updateData: Object.keys(data) });
      return project;
    } catch (error) {
      logServiceError('ProjectService', 'updateProject', error, { projectId, userId, role, updateData: Object.keys(data) });
      throw error;
    }
  }

  async deleteProject(projectId: string, role: string, userId: string) {
    try {
      logServiceMethod('ProjectService', 'deleteProject', LOGGER_MESSAGES.PROJECT_CREATED, { projectId, role, userId });
      validateObjectInstance.validateObjectId(projectId, 'project ID');
      const project = await this.checkProject(projectId);
      this.checkAdminOrOwner(project, userId, role);
      await project.deleteOne();
      await AuditUtil.logActivity(
        userId,
        'DELETE_PROJECT',
        projectId,
        'Project',
        `Project "${project.name}" deleted`
      );
      logServiceMethod('ProjectService', 'deleteProject', LOGGER_MESSAGES.PROJECT_CREATED, { projectId, userId, name: project.name });
      return { projectId };
    } catch (error) {
      logServiceError('ProjectService', 'deleteProject', error, { projectId, role, userId });
      throw error;
    }
  }

  async checkProject(projectId: string) {
    try {
      const project = await projectQuery.findProjectById(projectId);
      if (!project) {
        logServiceMethod('ProjectService', 'checkProject', LOGGER_MESSAGES.PROJECT_FETCH_FAILED, { projectId });
        throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);
      }
      return project;
    } catch (error) {
      logServiceError('ProjectService', 'checkProject', error, { projectId });
      throw error;
    }
  }

  async assignMembers(projectId: string, data: AssignMembersDto) {
    try {
      logServiceMethod('ProjectService', 'assignMembers', `Member assignment requested`, { projectId, memberCount: data.memberIds.length });
      
      validateObjectIdArray(data.memberIds, 'memberIds');
      const project = await projectQuery.findProjectandUpdate(
        projectId,
        { $addToSet: { members: { $each: data.memberIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      );
      if (!project) {
        logServiceMethod('ProjectService', 'assignMembers', `Project not found for member assignment`, { projectId });
        throw Exceptions.NotFound(USER_MESSAGES.PROJECT_NOT_FOUND);
      }
      
      logServiceMethod('ProjectService', 'assignMembers', `Members assigned successfully`, { projectId, memberCount: data.memberIds.length });
      return project;
    } catch (error) {
      logServiceError('ProjectService', 'assignMembers', error, { projectId, memberCount: data.memberIds.length });
      throw error;
    }
  }

  async removeMembers(projectId: string, data: RemoveMembersDto) {
    try {
      logServiceMethod('ProjectService', 'removeMembers', `Member removal requested`, { projectId, memberCount: data.memberIds.length });
      
      validateObjectIdArray(data.memberIds, 'memberIds');
      const project = await projectQuery.findProjectandUpdate(
        projectId,
        { $pull: { members: { $in: data.memberIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      );
      if (!project) {
        logServiceMethod('ProjectService', 'removeMembers', `Project not found for member removal`, { projectId });
        throw Exceptions.NotFound(USER_MESSAGES.PROJECT_NOT_FOUND);
      }
      
      logServiceMethod('ProjectService', 'removeMembers', `Members removed successfully`, { projectId, memberCount: data.memberIds.length });
      return project;
    } catch (error) {
      logServiceError('ProjectService', 'removeMembers', error, { projectId, memberCount: data.memberIds.length });
      throw error;
    }
  }

  async assignTasks(projectId: string, data: AssignTasksDto) {
    try {
      logServiceMethod('ProjectService', 'assignTasks', `Task assignment requested`, { projectId, taskCount: data.taskIds.length });
      
      validateObjectIdArray(data.taskIds, 'taskIds');
      const project = await projectQuery.findProjectandUpdate(
        projectId,
        { $addToSet: { tasks: { $each: data.taskIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      );
      if (!project) {
        logServiceMethod('ProjectService', 'assignTasks', `Project not found for task assignment`, { projectId });
        throw Exceptions.NotFound(USER_MESSAGES.PROJECT_NOT_FOUND);
      }
      
      logServiceMethod('ProjectService', 'assignTasks', `Tasks assigned successfully`, { projectId, taskCount: data.taskIds.length });
      return project;
    } catch (error) {
      logServiceError('ProjectService', 'assignTasks', error, { projectId, taskCount: data.taskIds.length });
      throw error;
    }
  }

  async removeTasks(projectId: string, data: RemoveTasksDto) {
    try {
      logServiceMethod('ProjectService', 'removeTasks', `Task removal requested`, { projectId, taskCount: data.taskIds.length });
      
      validateObjectIdArray(data.taskIds, 'taskIds');
      const project = await projectQuery.findProjectandUpdate(
        projectId,
        { $pull: { tasks: { $in: data.taskIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      );
      if (!project) {
        logServiceMethod('ProjectService', 'removeTasks', `Project not found for task removal`, { projectId });
        throw Exceptions.NotFound(USER_MESSAGES.PROJECT_NOT_FOUND);
      }
      
      logServiceMethod('ProjectService', 'removeTasks', `Tasks removed successfully`, { projectId, taskCount: data.taskIds.length });
      return project;
    } catch (error) {
      logServiceError('ProjectService', 'removeTasks', error, { projectId, taskCount: data.taskIds.length });
      throw error;
    }
  }

  async getProjectsByUser(userId: string, role: string) {
    try {
      logServiceMethod('ProjectService', 'getProjectsByUser', `Fetching projects for user`, { userId, role });
      
      const projects =
        role === 'admin'
          ? await projectQuery.getAllProjects()
          : await projectQuery.getProjectsByUserId(userId);
      
      logServiceMethod('ProjectService', 'getProjectsByUser', `Projects fetched successfully`, { userId, role, count: projects.length });
      return projects;
    } catch (error) {
      logServiceError('ProjectService', 'getProjectsByUser', error, { userId, role });
      throw error;
    }
  }

  // Helper to check admin or project owner
  private checkAdminOrOwner(project: any, userId: string, role: string) {
    if (role !== 'admin' && String(project.createdBy) !== userId) {
      logServiceMethod('ProjectService', 'checkAdminOrOwner', LOGGER_MESSAGES.FETCH_PROJECTS_FAILED, { projectId: project._id, userId, role, createdBy: project.createdBy });
      throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);
    }
  }
}
