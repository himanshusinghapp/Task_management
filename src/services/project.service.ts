import mongoose from 'mongoose';
import { logMessage } from '../utils/logger';
import { LOGGER_MESSAGES } from '../common/constants/logger.constant';
import { USER_MESSAGES } from '../common/constants/userMessage';
import {
  findProjectById,
  getAllProjects,
  getProjectsByUserId,
} from '../utils/query';
import { Exceptions } from '../common/customException';
import { Project } from '../models/project.model';

export class ProjectService {
  async createProject(data: any, createdBy: string) {
    try {
      const project = await new Project({ ...data, createdBy }).save();
      logMessage('info', LOGGER_MESSAGES.PROJECT_CREATED, {
        createdBy,
        projectId: project._id,
      });
      return project;
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.PROJECT_CREATION_FAILED, {
        error: err.message,
      });
      throw Exceptions.InternalServerError(USER_MESSAGES.CREATE_FAILED);
    }
  }

  async assignMembers(projectId: string, memberIds: string[]) {
    try {
      const project = await findProjectById(projectId);
      if (!project) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);

      const uniqueMembers = new Set([
        ...project.members.map((id) => id.toString()),
        ...memberIds,
      ]);
      project.members = Array.from(uniqueMembers).map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      await project.save();
      logMessage('info', LOGGER_MESSAGES.MEMBERS_ASSIGNED, { projectId });
      return { message: USER_MESSAGES.MEMBERS_ASSIGNED, project };
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ASSIGN_MEMBERS_FAILED, {
        error: err.message,
      });
      throw Exceptions.BadRequest(err.message);
    }
  }

  async assignTasks(projectId: string, taskIds: string[]) {
    try {
      const project = await findProjectById(projectId);
      if (!project) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);

      const uniqueTasks = new Set([
        ...project.tasks.map((id) => id.toString()),
        ...taskIds,
      ]);
      project.tasks = Array.from(uniqueTasks).map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      await project.save();
      logMessage('info', LOGGER_MESSAGES.TASKS_ASSIGNED, { projectId });
      return { message: USER_MESSAGES.TASKS_ASSIGNED, project };
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ASSIGN_TASKS_FAILED, {
        error: err.message,
      });
      throw Exceptions.BadRequest(err.message);
    }
  }

  async getProjectsByUser(userId: string, role: string) {
    try {
      const projects =
        role === 'admin'
          ? await getAllProjects()
          : await getProjectsByUserId(userId);

      return projects;
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.FETCH_PROJECTS_FAILED, {
        error: err.message,
      });
      throw Exceptions.InternalServerError(USER_MESSAGES.FETCH_FAILED);
    }
  }
}
