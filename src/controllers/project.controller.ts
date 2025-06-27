import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '@services/project.service';
import { logMessage } from '@utils/logger';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import { USER_MESSAGES } from '@common/constants/userMessage';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';
import { AuthenticatedRequest } from '@middlewares/auth.middleware';
import { ResponseHelper } from '@common/helpers/response.helper';
import { CreateProjectDto, UpdateProjectDto, AssignMembersDto, RemoveMembersDto, AssignTasksDto, RemoveTasksDto } from '@dto/project.dto';

const projectService = new ProjectService();

export class ProjectController {
  async createProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const body: CreateProjectDto = req.body;
      const result = await projectService.createProject(body, req.user._id);
      return res.status(HTTP_STATUS.CREATED).json(ResponseHelper.created(USER_MESSAGES.PROJECT_CREATED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.PROJECT_CREATION_FAILED, { error: err.message });
      return next(err);
    }
  }

  async updateProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const body: UpdateProjectDto = req.body;
      const result = await projectService.updateProject(projectId, body);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.PROJECT_UPDATED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.UPDATE, { error: err.message });
      return next(err);
    }
  }

  async deleteProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const result = await projectService.deleteProject(projectId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.PROJECT_DELETED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.DELETE, { error: err.message });
      return next(err);
    }
  }

  async assignMembers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const body: AssignMembersDto = req.body;
      const result = await projectService.assignMembers(projectId, body);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.MEMBERS_ASSIGNED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ASSIGN_MEMBERS_FAILED, { error: err.message });
      return next(err);
    }
  }

  async removeMembers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const body: RemoveMembersDto = req.body;
      const result = await projectService.removeMembers(projectId, body);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.MEMEBERS_REMOVED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.UPDATE, { error: err.message });
      return next(err);
    }
  }

  async assignTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const body: AssignTasksDto = req.body;
      const result = await projectService.assignTasks(projectId, body);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASKS_ASSIGNED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ASSIGN_TASKS_FAILED, { error: err.message });
      return next(err);
    }
  }

  async removeTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const body: RemoveTasksDto = req.body;
      const result = await projectService.removeTasks(projectId, body);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASK_REMOVED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.UPDATE, { error: err.message });
      return next(err);
    }
  }

  async getProjects(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await projectService.getProjectsByUser(req.user._id, req.user.role);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.PROJECT_FETCHED, result));
    } catch (err: any) {
      return next(err);
    }
  }
}
