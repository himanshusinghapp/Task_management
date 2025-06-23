// admin.controller.ts
import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import {signupSchema as adminSignupSchema} from '../dto/signup.dto';
import { loginSchema as adminLoginSchema } from '../dto/login.dto';
import { HTTP_STATUS } from '../common/constants/httpStatus';
import { logMessage } from '../utils/logger';
import { LOGGER_MESSAGES } from '../common/constants/logger.constant';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

const adminService = new AdminService();

export class AdminController {
  async signup(req: Request, res: Response) {
    try {
      const { error, value } = adminSignupSchema.validate(req.body);
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });

      const result = await adminService.signup(value.name, value.email, value.password);
      return res.status(HTTP_STATUS.CREATED).json(result);
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ADMIN_SIGNUP_FAILED, { error: err.message });
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { error, value } = adminLoginSchema.validate(req.body);
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });

      const result = await adminService.login(value.email, value.password);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ADMIN_LOGIN_FAILED, { error: err.message });
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: err.message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const result = await adminService.getAllUsers();
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async blockUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await adminService.blockUser(userId);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async unblockUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await adminService.unblockUser(userId);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async searchUsers(req: Request, res: Response) {
    try {
      const { query } = req.query;
      const result = await adminService.searchUsers(query as string);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const admin = req.user;
      const result = await adminService.getProfile(admin._id);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: err.message });
    }
  }

  async logout(req: AuthenticatedRequest, res: Response) {
    try {
      const admin = req.user;
      const result = await adminService.logout(admin._id);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }
}
