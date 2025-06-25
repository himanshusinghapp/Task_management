import mongoose from 'mongoose';
import { logMessage } from '@utils/logger';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';

import {projectQuery} from '../utils/query';
import { Exceptions } from '../common/exception/customException';
import { Project } from '../models/project.model';
import { validateObjectIdArray } from '../common/helpers/validateObjectIdArray';
import { USER_MESSAGES } from '@/common/constants/userMessage';

export class ProjectService {
  async createProject(data: any, createdBy: string) {
    const existing = await Project.findOne({ name: data.name });
    if (existing) throw Exceptions.BadRequest(USER_MESSAGES.PROJECT_NAME_EXISTS);
    const project = await Project.create({ ...data, createdBy });
    logMessage('info', LOGGER_MESSAGES.PROJECT_CREATED, {
      createdBy,
      projectId: project._id,
    });
    return { id: project._id, name: project.name, description: project.description };
  }

  async updateProject(projectId: string, update: any) {
    const project = await projectQuery.findProjectandUpdate(projectId, update);
    if (!project) throw Exceptions.NotFound(USER_MESSAGES.PROJECT_NOT_FOUND);
    return project;
  }

  async deleteProject(projectId: string) {
    const project = await projectQuery.deleteProjectById(projectId);
    if (!project) throw Exceptions.NotFound(USER_MESSAGES.PROJECT_NOT_FOUND);
    return { id: project._id };
  }

  async assignMembers(projectId: string, memberIds: string[]) {
    validateObjectIdArray(memberIds, 'memberIds');
    const project = await projectQuery.findProjectandUpdate(
      projectId,
      { $addToSet: { members: { $each: memberIds.map(id => new mongoose.Types.ObjectId(id)) } } },
    );
    if (!project) throw Exceptions.NotFound(USER_MESSAGES.PROJECT_NOT_FOUND);
    return project;
  }

  async removeMembers(projectId: string, memberIds: string[]) {
    validateObjectIdArray(memberIds, 'memberIds');
    const project = await projectQuery.findProjectandUpdate(
      projectId,
      { $pull: { members: { $in: memberIds.map(id => new mongoose.Types.ObjectId(id)) } } },
    );
    if (!project) throw Exceptions.NotFound(USER_MESSAGES.PROJECT_NOT_FOUND);
    return project;
  }

  async assignTasks(projectId: string, taskIds: string[]) {
    validateObjectIdArray(taskIds, 'taskIds');
    const project = await projectQuery.findProjectandUpdate(
      projectId,
      { $addToSet: { tasks: { $each: taskIds.map(id => new mongoose.Types.ObjectId(id)) } } },
    );
    if (!project) throw Exceptions.NotFound(USER_MESSAGES.PROJECT_NOT_FOUND);
    return project;
  }

  async removeTasks(projectId: string, taskIds: string[]) {
    validateObjectIdArray(taskIds, 'taskIds');
    const project = await projectQuery.findProjectandUpdate(
      projectId,
      { $pull: { tasks: { $in: taskIds.map(id => new mongoose.Types.ObjectId(id)) } } },
    );
    if (!project) throw Exceptions.NotFound(USER_MESSAGES.PROJECT_NOT_FOUND);
    return project;
  }

  async getProjectsByUser(userId: string, role: string) {
    const projects =
      role === 'admin'
        ? await projectQuery.getAllProjects()
        : await projectQuery.getProjectsByUserId(userId);
    return projects;
  }
}
