// user.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/user.service';
import { signupSchema } from '../dto/signup.dto';
import { loginSchema } from '../dto/login.dto';
import { forgotPasswordSchema } from '../dto/forgot-password.dto';
import { resetPasswordSchema } from '../dto/reset-password.dto';
import { changePasswordSchema } from '../dto/change-password.dto';
import { editProfileSchema } from '../dto/edit-profile.dto';
import { HTTP_STATUS } from '../common/constants/httpStatus';
import { USER_MESSAGES } from '../common/constants/userMessage';
import { logMessage } from '../utils/logger';
import { LOGGER_MESSAGES } from '../common/constants/logger.constant';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const { error, value } = signupSchema.validate(req.body);
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });

      const { name, email, password } = value;
      const result = await authService.signup(name, email, password);
      logMessage('info', LOGGER_MESSAGES.USER_CREATED, { email });
      return res.status(HTTP_STATUS.CREATED).json(result);
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.USER_CREATION_FAILED, { error: err.message });
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: USER_MESSAGES.MISSING_USER_ID });
      }

      const result = await authService.resendOtp(userId);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { userId, otp } = req.body;
      if (!userId || !otp) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: USER_MESSAGES.MISSING_USER_OR_OTP });
      }

      const result = await authService.verifyEmail(userId, otp);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });

      const { email, password } = value;
      const result = await authService.login(email, password);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { error, value } = forgotPasswordSchema.validate(req.body);
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });

      const result = await authService.forgotPassword(value.email);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { error, value } = resetPasswordSchema.validate(req.body);
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });

      const result = await authService.resetPassword(value.userId, value.otp, value.newPassword);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const { error, value } = changePasswordSchema.validate(req.body);
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });

      const user = req.user;
      const result = await authService.changePassword(user._id, value.oldPassword, value.newPassword);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      const profile = await authService.getProfile(user._id);
      return res.status(HTTP_STATUS.OK).json(profile);
    } catch (err: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async editProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      const { error, value } = editProfileSchema.validate(req.body);
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });

      const result = await authService.editProfile(user._id, value);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async logout(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      const result = await authService.logout(user._id);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }
}
