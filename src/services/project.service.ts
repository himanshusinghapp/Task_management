import mongoose from 'mongoose';
import { logMessage } from '@utils/logger';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';

import {
  getAllProjects,
  getProjectsByUserId,
} from '../utils/query';
import { Exceptions } from '../common/exception/customException';
import { Project } from '../models/project.model';
import { validateObjectIdArray } from '../common/helpers/validateObjectIdArray';

export class ProjectService {
  async createProject(data: any, createdBy: string) {
    const existing = await Project.findOne({ name: data.name });
    if (existing) throw Exceptions.BadRequest('Project name already exists');
    const project = await Project.create({ ...data, createdBy });
    logMessage('info', LOGGER_MESSAGES.PROJECT_CREATED, {
      createdBy,
      projectId: project._id,
    });
    return { id: project._id, name: project.name, description: project.description };
  }

  async updateProject(projectId: string, update: any) {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();
    if (!project) throw Exceptions.NotFound('Project not found');
    return project;
  }

  async deleteProject(projectId: string) {
    const project = await Project.findByIdAndDelete(projectId).lean();
    if (!project) throw Exceptions.NotFound('Project not found');
    return { id: project._id };
  }

  async assignMembers(projectId: string, memberIds: string[]) {
    validateObjectIdArray(memberIds, 'memberIds');
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: { $each: memberIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      { new: true }
    ).lean();
    if (!project) throw Exceptions.NotFound('Project not found');
    return project;
  }

  async removeMembers(projectId: string, memberIds: string[]) {
    validateObjectIdArray(memberIds, 'memberIds');
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { members: { $in: memberIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      { new: true }
    ).lean();
    if (!project) throw Exceptions.NotFound('Project not found');
    return project;
  }

  async assignTasks(projectId: string, taskIds: string[]) {
    validateObjectIdArray(taskIds, 'taskIds');
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { tasks: { $each: taskIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      { new: true }
    ).lean();
    if (!project) throw Exceptions.NotFound('Project not found');
    return project;
  }

  async removeTasks(projectId: string, taskIds: string[]) {
    validateObjectIdArray(taskIds, 'taskIds');
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { tasks: { $in: taskIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      { new: true }
    ).lean();
    if (!project) throw Exceptions.NotFound('Project not found');
    return project;
  }

  async getProjectsByUser(userId: string, role: string) {
    const projects =
      role === 'admin'
        ? await getAllProjects()
        : await getProjectsByUserId(userId);
    return projects;
  }
}
