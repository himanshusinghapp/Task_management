// admin.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AdminService } from '@services/admin.service';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import { logControllerMethod, logControllerError } from '@utils/logger';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';
import { AuthenticatedRequest } from '@middlewares/auth.middleware';
import { ResponseHelper } from '@common/helpers/response.helper';
import { USER_MESSAGES } from '@/common/constants/userMessage';
import {
  LoginAdminDto,
  SearchQueryDto
} from '@dto/admin.dto';

const adminService = new AdminService();

export class AdminController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body: LoginAdminDto = req.body;
      const { email, password } = body;
      logControllerMethod('AdminController', 'login', LOGGER_MESSAGES.ADMIN_LOGIN_SUCCESS, { email, ip: req.ip });
      
      const result = await adminService.login(email, password);
      
      logControllerMethod('AdminController', 'login', LOGGER_MESSAGES.ADMIN_LOGIN_SUCCESS, { email, adminId: result.admin.id });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.ADMIN_LOGIN_SUCCESS, result));
    } catch (err: any) {
      logControllerError('AdminController', 'login', err, { email: req.body?.email, ip: req.ip });
      return next(err);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      logControllerMethod('AdminController', 'getAllUsers', LOGGER_MESSAGES.USER_FETCHED, { ip: req.ip });
      
      const result = await adminService.getAllUsers();
      
      logControllerMethod('AdminController', 'getAllUsers', LOGGER_MESSAGES.USER_FETCHED, { count: result.length });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.USER_FETCH_SUCCESS, result));
    } catch (err: any) {
      logControllerError('AdminController', 'getAllUsers', err, { ip: req.ip });
      return next(err);
    }
  }

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      logControllerMethod('AdminController', 'blockUser', LOGGER_MESSAGES.ADMIN_BLOCK_USER, { userId, ip: req.ip });
      
      const result = await adminService.blockUser(userId);
      
      logControllerMethod('AdminController', 'blockUser', LOGGER_MESSAGES.ADMIN_BLOCK_USER, { userId });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.USER_BLOCKED, result));
    } catch (err: any) {
      logControllerError('AdminController', 'blockUser', err, { userId: req.params.userId, ip: req.ip });
      return next(err);
    }
  }

  async unblockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      logControllerMethod('AdminController', 'unblockUser', LOGGER_MESSAGES.ADMIN_UNBLOCK_USER, { userId, ip: req.ip });
      
      const result = await adminService.unblockUser(userId);
      
      logControllerMethod('AdminController', 'unblockUser', LOGGER_MESSAGES.ADMIN_UNBLOCK_USER, { userId });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.USER_UNBLOCKED, result));
    } catch (err: any) {
      logControllerError('AdminController', 'unblockUser', err, { userId: req.params.userId, ip: req.ip });
      return next(err);
    }
  }

  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const queryObj: SearchQueryDto = req.query as SearchQueryDto;
      logControllerMethod('AdminController', 'searchUsers', LOGGER_MESSAGES.USER_FETCHED, { query: queryObj.query, ip: req.ip });
      
      const result = await adminService.searchUsers(queryObj.query || '');
      
      logControllerMethod('AdminController', 'searchUsers', LOGGER_MESSAGES.USER_FETCHED, { query: queryObj.query, count: result.length });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.USER_SEARCH_SUCCESS, result));
    } catch (err: any) {
      logControllerError('AdminController', 'searchUsers', err, { query: req.query?.query, ip: req.ip });
      return next(err);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const admin = req.user;
      logControllerMethod('AdminController', 'getProfile', LOGGER_MESSAGES.USER_FETCHED, { adminId: admin._id, ip: req.ip });
      
      const result = await adminService.getProfile(admin._id);
      
      logControllerMethod('AdminController', 'getProfile', LOGGER_MESSAGES.USER_FETCHED, { adminId: admin._id });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.USER_PROFILE_FETCHED, result));
    } catch (err: any) {
      logControllerError('AdminController', 'getProfile', err, { adminId: req.user?._id, ip: req.ip });
      return next(err);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const admin = req.user;
      logControllerMethod('AdminController', 'logout', LOGGER_MESSAGES.ADMIN_LOGOUT, { adminId: admin._id, ip: req.ip });
      
      const result = await adminService.logout(admin._id);
      
      logControllerMethod('AdminController', 'logout', LOGGER_MESSAGES.ADMIN_LOGOUT, { adminId: admin._id });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.ADMIN_LOGOUT_SUCCESS, result));
    } catch (err: any) {
      logControllerError('AdminController', 'logout', err, { adminId: req.user?._id, ip: req.ip });
      return next(err);
    }
  }
}
