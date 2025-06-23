import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';
import { logMessage } from '../utils/logger';
import { HTTP_STATUS } from '../common/constants/httpStatus';
import { USER_MESSAGES } from '../common/constants/userMessage';
import { LOGGER_MESSAGES } from '../common/constants/logger.constant';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

const projectService = new ProjectService();

export class ProjectController {
  async createProject(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await projectService.createProject(req.body, req.user._id);
      return res.status(HTTP_STATUS.CREATED).json({ message: USER_MESSAGES.PROJECT_CREATED, data: result });
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.PROJECT_CREATION_FAILED, { error: err.message });
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async assignMembers(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const { memberIds } = req.body;
      const result = await projectService.assignMembers(projectId, memberIds);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ASSIGN_MEMBERS_FAILED, { error: err.message });
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async assignTasks(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const { taskIds } = req.body;
      const result = await projectService.assignTasks(projectId, taskIds);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ASSIGN_TASKS_FAILED, { error: err.message });
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async getProjects(req: Request, res: Response) {
    try {
      const result = await projectService.getProjectsByUser(req.body.admin._id, req.body.admin.role);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }
}
