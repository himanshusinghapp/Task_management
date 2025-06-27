// user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '@services/user.service';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import { USER_MESSAGES } from '@common/constants/userMessage';
import { AuthenticatedRequest } from '@middlewares/auth.middleware';
import { ResponseHelper } from '@common/helpers/response.helper';
import { RequestEmailVerificationDto, VerifyEmailOtpDto, CompleteSignupDto } from '@dto/user-public.dto';
import { LoginDto } from '@dto/login.dto';
import { ResetPasswordDto } from '@dto/reset-password.dto';
import { ForgotPasswordDto } from '@dto/forgot-password.dto';
import { EditProfileDto } from '@dto/edit-profile.dto';
import { ChangePasswordDto } from '@dto/change-password.dto';

const userService = new UserService();

export class UserController {
  async requestEmailVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const body: RequestEmailVerificationDto = req.body;
      const result = await userService.requestEmailVerification(body.email);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.OTP_SENT, result));
    } catch (err: any) {
      return next(err);
    }
  }

  async verifyEmailOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const body: VerifyEmailOtpDto = req.body;
      const result = await userService.verifyEmailOtp(body.email, body.otp);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.EMAIL_VERIFIED, result));
    } catch (err: any) {
      return next(err);
    }
  }

  async completeSignup(req: Request, res: Response, next: NextFunction) {
    try {
      const body: CompleteSignupDto = req.body;
      const result = await userService.completeSignup(body.name, body.email, body.password);
      return res.status(HTTP_STATUS.CREATED).json(ResponseHelper.created(USER_MESSAGES.USER_CREATED, result));
    } catch (err: any) {
      return next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body: LoginDto = req.body;
      const result = await userService.login(body.email, body.password);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.LOGIN_SUCCESS, result));
    } catch (err: any) {
      return next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body: ForgotPasswordDto = req.body;
      const result = await userService.forgotPassword(body.email);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.OTP_SENT, result));
    } catch (err: any) {
      return next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body: ResetPasswordDto = req.body;
      const result = await userService.resetPassword(body.userId, body.otp, body.newPassword);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.PASSWORD_RESET_SUCCESS, result));
    } catch (err: any) {
      return next(err);
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const body: ChangePasswordDto = req.body;
      const result = await userService.changePassword(user._id, body.oldPassword, body.newPassword);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.PASSWORD_CHANGED_SUCCESS, result));
    } catch (err: any) {
      return next(err);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const profile = await userService.getProfile(user._id);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.PROFILE_FETCHED, profile));
    } catch (err: any) {
      return next(err);
    }
  }

  async editProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const body: EditProfileDto = req.body;
      const result = await userService.editProfile(user._id, body);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.PROFILE_UPDATED_SUCCESS, result));
    } catch (err: any) {
      return next(err);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const result = await userService.logout(user._id);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.LOGOUT_SUCCESS, result));
    } catch (err: any) {
      return next(err);
    }
  }
}
