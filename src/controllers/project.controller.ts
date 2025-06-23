import { Request, Response } from 'express';
import { ProjectService } from '@services/project.service';
import { logMessage } from '@utils/logger';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import { USER_MESSAGES } from '@common/constants/userMessage';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';
import { AuthenticatedRequest } from '@middlewares/auth.middleware';
import { ResponseHelper } from '@common/helpers/response.helper';
import { createProjectDto, updateProjectDto, assignMembersDto, removeMembersDto, assignTasksDto, removeTasksDto, projectIdDto } from '@dto/project.dto';

const projectService = new ProjectService();

export class ProjectController {
  async createProject(req: AuthenticatedRequest, res: Response) {
    try {
      const { error } = createProjectDto.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.details.map(e => e.message).join(', ')));
      }
      const result = await projectService.createProject(req.body, req.user._id);
      return res.status(HTTP_STATUS.CREATED).json(ResponseHelper.created(USER_MESSAGES.PROJECT_CREATED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.PROJECT_CREATION_FAILED, { error: err.message });
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(ResponseHelper.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message));
    }
  }

  async updateProject(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const { error: paramError } = projectIdDto.validate({ projectId });
      if (paramError) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, paramError.message));
      const { error } = updateProjectDto.validate(req.body, { abortEarly: false });
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.details.map(e => e.message).join(', ')));
      const result = await projectService.updateProject(projectId, req.body);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Project updated successfully', result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.UPDATE, { error: err.message });
      return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async deleteProject(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const { error: paramError } = projectIdDto.validate({ projectId });
      if (paramError) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, paramError.message));
      const result = await projectService.deleteProject(projectId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Project deleted successfully', result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.DELETE, { error: err.message });
      return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async assignMembers(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const { error: paramError } = projectIdDto.validate({ projectId });
      if (paramError) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, paramError.message));
      const { error } = assignMembersDto.validate(req.body, { abortEarly: false });
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.details.map(e => e.message).join(', ')));
      const result = await projectService.assignMembers(projectId, req.body.memberIds);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Members assigned successfully', result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ASSIGN_MEMBERS_FAILED, { error: err.message });
      return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async removeMembers(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const { error: paramError } = projectIdDto.validate({ projectId });
      if (paramError) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, paramError.message));
      const { error } = removeMembersDto.validate(req.body, { abortEarly: false });
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.details.map(e => e.message).join(', ')));
      const result = await projectService.removeMembers(projectId, req.body.memberIds);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Members removed successfully', result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.UPDATE, { error: err.message });
      return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async assignTasks(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const { error: paramError } = projectIdDto.validate({ projectId });
      if (paramError) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, paramError.message));
      const { error } = assignTasksDto.validate(req.body, { abortEarly: false });
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.details.map(e => e.message).join(', ')));
      const result = await projectService.assignTasks(projectId, req.body.taskIds);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Tasks assigned successfully', result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ASSIGN_TASKS_FAILED, { error: err.message });
      return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async removeTasks(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const { error: paramError } = projectIdDto.validate({ projectId });
      if (paramError) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, paramError.message));
      const { error } = removeTasksDto.validate(req.body, { abortEarly: false });
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.details.map(e => e.message).join(', ')));
      const result = await projectService.removeTasks(projectId, req.body.taskIds);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Tasks removed successfully', result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.UPDATE, { error: err.message });
      return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async getProjects(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await projectService.getProjectsByUser(req.user._id, req.user.role);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Projects fetched successfully', result));
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(ResponseHelper.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message));
    }
  }
}
