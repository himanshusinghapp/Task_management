// admin.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AdminService } from '@services/admin.service';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import { logMessage } from '@utils/logger';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';
import { AuthenticatedRequest } from '@middlewares/auth.middleware';
import { ResponseHelper } from '@common/helpers/response.helper';
import { USER_MESSAGES } from '@/common/constants/userMessage';
import { SearchQueryDto, BlockUserDto } from '@dto/admin.dto';

const adminService = new AdminService();

export class AdminController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await adminService.login(email, password);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.ADMIN_LOGIN_SUCCESS, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ADMIN_LOGIN_FAILED, { error: err.message });
      return next(err);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.getAllUsers();
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.USER_FETCH_SUCCESS, result));
    } catch (err: any) {
      return next(err);
    }
  }

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const result = await adminService.blockUser(userId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.USER_BLOCKED, result));
    } catch (err: any) {
      return next(err);
    }
  }

  async unblockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const result = await adminService.unblockUser(userId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.USER_UNBLOCKED, result));
    } catch (err: any) {
      return next(err);
    }
  }

  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const queryObj: SearchQueryDto = req.query as any;
      const result = await adminService.searchUsers(queryObj.query);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.USER_SEARCH_SUCCESS, result));
    } catch (err: any) {
      return next(err);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const admin = req.user;
      const result = await adminService.getProfile(admin._id);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.USER_PROFILE_FETCHED, result));
    } catch (err: any) {
      return next(err);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const admin = req.user;
      const result = await adminService.logout(admin._id);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.ADMIN_LOGOUT_SUCCESS, result));
    } catch (err: any) {
      return next(err);
    }
  }
}
