// admin.controller.ts
import { Request, Response } from 'express';
import { AdminService } from '@services/admin.service';
import {signupSchema as adminSignupSchema} from '@dto/signup.dto';
import { loginSchema as adminLoginSchema } from '@dto/login.dto';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import { logMessage } from '@utils/logger';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';
import { AuthenticatedRequest } from '@middlewares/auth.middleware';
import { ResponseHelper } from '@common/helpers/response.helper';
import {searchQueryDto} from '@dto/admin.dto'
import { validateObjectId } from '@common/helpers/validateObjectId';

const adminService = new AdminService();



export class AdminController {
  async signup(req: Request, res: Response) {
    try {
      const { error, value } = adminSignupSchema.validate(req.body);
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.message));

      const result = await adminService.signup(value.name, value.email, value.password);
      return res.status(HTTP_STATUS.CREATED).json(ResponseHelper.created('Admin created successfully', result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ADMIN_SIGNUP_FAILED, { error: err.message });
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(ResponseHelper.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message));
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { error, value } = adminLoginSchema.validate(req.body);
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.message));

      const result = await adminService.login(value.email, value.password);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Login successful', result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ADMIN_LOGIN_FAILED, { error: err.message });
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(ResponseHelper.error(HTTP_STATUS.UNAUTHORIZED, err.message));
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const result = await adminService.getAllUsers();
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Users fetched successfully', result));
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(ResponseHelper.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message));
    }
  }

  async blockUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      validateObjectId(userId, 'user ID');
      const result = await adminService.blockUser(userId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('User blocked successfully', result));
    } catch (err: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async unblockUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      validateObjectId(userId, 'user ID');
      const result = await adminService.unblockUser(userId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('User unblocked successfully', result));
    } catch (err: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async searchUsers(req: Request, res: Response) {
    try {
      const { error } = searchQueryDto.validate(req.query);
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.message));
      const { query } = req.query;
      const result = await adminService.searchUsers(query as string);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Users search successful', result));
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(ResponseHelper.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message));
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const admin = req.user;
      const result = await adminService.getProfile(admin._id);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Profile fetched successfully', result));
    } catch (err: any) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(ResponseHelper.error(HTTP_STATUS.NOT_FOUND, err.message));
    }
  }

  async logout(req: AuthenticatedRequest, res: Response) {
    try {
      const admin = req.user;
      const result = await adminService.logout(admin._id);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success('Logout successful', result));
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(ResponseHelper.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message));
    }
  }
}
