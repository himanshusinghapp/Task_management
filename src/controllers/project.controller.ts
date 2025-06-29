import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '@services/project.service';
import { logMessage, logControllerMethod, logControllerError } from '@utils/logger';
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
      const { user } = req;
      const body: CreateProjectDto = req.body;
      logControllerMethod('ProjectController', 'createProject', LOGGER_MESSAGES.CREATE, { userId: user._id, role: user.role, ip: req.ip });
      
      const result = await projectService.createProject(body, user._id, user.role);
      
      logControllerMethod('ProjectController', 'createProject', LOGGER_MESSAGES.CREATE, { userId: user._id, projectId: result._id, name: result.name });
      return res.status(HTTP_STATUS.CREATED).json(ResponseHelper.success(USER_MESSAGES.PROJECT_CREATED, result));
    } catch (err: any) {
      logControllerError('ProjectController', 'createProject', err, { userId: req.user?._id, role: req.user?.role, ip: req.ip });
      return next(err);
    }
  }

  async updateProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { projectId } = req.params;
      const body: UpdateProjectDto = req.body;
      logControllerMethod('ProjectController', 'updateProject', LOGGER_MESSAGES.UPDATE, { projectId, userId: user._id, role: user.role, updateData: Object.keys(body), ip: req.ip });
      
      const result = await projectService.updateProject(projectId, user._id, user.role, body);
      
      logControllerMethod('ProjectController', 'updateProject', LOGGER_MESSAGES.UPDATE, { projectId, userId: user._id, updateData: Object.keys(req.body) });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.PROJECT_UPDATED, result));
    } catch (err: any) {
      logControllerError('ProjectController', 'updateProject', err, { projectId: req.params.projectId, userId: req.user?._id, role: req.user?.role, updateData: Object.keys(req.body), ip: req.ip });
      return next(err);
    }
  }

  async deleteProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { projectId } = req.params;
      logControllerMethod('ProjectController', 'deleteProject', LOGGER_MESSAGES.DELETE, { projectId, userId: user._id, role: user.role, ip: req.ip });
      
      const result = await projectService.deleteProject(projectId, user.role, user._id);
      
      logControllerMethod('ProjectController', 'deleteProject', LOGGER_MESSAGES.DELETE, { projectId, userId: user._id });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.PROJECT_DELETED, result));
    } catch (err: any) {
      logControllerError('ProjectController', 'deleteProject', err, { projectId: req.params.projectId, userId: req.user?._id, role: req.user?.role, ip: req.ip });
      return next(err);
    }
  }

  async assignMembers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const body: AssignMembersDto = req.body;
      const userId = req.user._id;
      
      logControllerMethod('ProjectController', 'assignMembers', `Member assignment request received`, { projectId, userId, memberCount: body.memberIds.length, ip: req.ip });
      
      const result = await projectService.assignMembers(projectId, body);
      
      logControllerMethod('ProjectController', 'assignMembers', `Members assigned successfully`, { projectId, userId, memberCount: body.memberIds.length });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.MEMBERS_ASSIGNED, result));
    } catch (err: any) {
      logControllerError('ProjectController', 'assignMembers', err, { projectId: req.params.projectId, userId: req.user._id, ip: req.ip });
      logMessage('error', LOGGER_MESSAGES.ASSIGN_MEMBERS_FAILED, { error: err.message });
      return next(err);
    }
  }

  async removeMembers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const body: RemoveMembersDto = req.body;
      const userId = req.user._id;
      
      logControllerMethod('ProjectController', 'removeMembers', `Member removal request received`, { projectId, userId, memberCount: body.memberIds.length, ip: req.ip });
      
      const result = await projectService.removeMembers(projectId, body);
      
      logControllerMethod('ProjectController', 'removeMembers', `Members removed successfully`, { projectId, userId, memberCount: body.memberIds.length });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.MEMEBERS_REMOVED, result));
    } catch (err: any) {
      logControllerError('ProjectController', 'removeMembers', err, { projectId: req.params.projectId, userId: req.user._id, ip: req.ip });
      logMessage('error', LOGGER_MESSAGES.UPDATE, { error: err.message });
      return next(err);
    }
  }

  async assignTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const body: AssignTasksDto = req.body;
      const userId = req.user._id;
      
      logControllerMethod('ProjectController', 'assignTasks', `Task assignment request received`, { projectId, userId, taskCount: body.taskIds.length, ip: req.ip });
      
      const result = await projectService.assignTasks(projectId, body);
      
      logControllerMethod('ProjectController', 'assignTasks', `Tasks assigned successfully`, { projectId, userId, taskCount: body.taskIds.length });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASKS_ASSIGNED, result));
    } catch (err: any) {
      logControllerError('ProjectController', 'assignTasks', err, { projectId: req.params.projectId, userId: req.user._id, ip: req.ip });
      logMessage('error', LOGGER_MESSAGES.ASSIGN_TASKS_FAILED, { error: err.message });
      return next(err);
    }
  }

  async removeTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const body: RemoveTasksDto = req.body;
      const userId = req.user._id;
      
      logControllerMethod('ProjectController', 'removeTasks', `Task removal request received`, { projectId, userId, taskCount: body.taskIds.length, ip: req.ip });
      
      const result = await projectService.removeTasks(projectId, body);
      
      logControllerMethod('ProjectController', 'removeTasks', `Tasks removed successfully`, { projectId, userId, taskCount: body.taskIds.length });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.TASK_REMOVED, result));
    } catch (err: any) {
      logControllerError('ProjectController', 'removeTasks', err, { projectId: req.params.projectId, userId: req.user._id, ip: req.ip });
      logMessage('error', LOGGER_MESSAGES.UPDATE, { error: err.message });
      return next(err);
    }
  }

  async getProjects(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const role = req.user.role;
      
      logControllerMethod('ProjectController', 'getProjects', `Get projects request received`, { userId, role, ip: req.ip });
      
      const result = await projectService.getProjectsByUser(userId, role);
      
      logControllerMethod('ProjectController', 'getProjects', `Projects fetched successfully`, { userId, role, count: result.length });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.PROJECT_FETCHED, result));
    } catch (err: any) {
      logControllerError('ProjectController', 'getProjects', err, { userId: req.user._id, role: req.user.role, ip: req.ip });
      return next(err);
    }
  }
}
