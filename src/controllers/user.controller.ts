import { Request, Response, NextFunction } from 'express';
import { UserService } from '@services';
import { AuthenticatedRequest } from '@middlewares';
import { HTTP_STATUS ,USER_MESSAGES,LOGGER_MESSAGES} from '@common/constants';
import { ResponseHelper } from '@common/helpers/response.helper';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UserPublicDto
} from '@dto';
import { logControllerMethod, logControllerError } from '@utils';

const userService = new UserService();

export class UserController {
  async requestEmailVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const body: UserPublicDto = req.body;
      logControllerMethod('UserController', 'requestEmailVerification', LOGGER_MESSAGES.EMAIL_SENT, { email: body.email, ip: req.ip });
      
      const result = await userService.requestEmailVerification(body.email);
      
      logControllerMethod('UserController', 'requestEmailVerification', LOGGER_MESSAGES.EMAIL_SENT, { email: body.email });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.OTP_SENT, result));
    } catch (err: any) {
      logControllerError('UserController', 'requestEmailVerification', err, { email: req.body?.email, ip: req.ip });
      return next(err);
    }
  }

  async verifyEmailOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body as { email: string; otp: string };
      logControllerMethod('UserController', 'verifyEmailOtp', LOGGER_MESSAGES.EMAIL_SENT, { email, ip: req.ip });
      
      const result = await userService.verifyEmailOtp(email, otp);
      
      logControllerMethod('UserController', 'verifyEmailOtp', LOGGER_MESSAGES.EMAIL_SENT, { email });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.EMAIL_VERIFIED, result));
    } catch (err: any) {
      logControllerError('UserController', 'verifyEmailOtp', err, { email: req.body?.email });
      return next(err);
    }
  }

  async completeSignup(req: Request, res: Response, next: NextFunction) {
    try {
      const body: CreateUserDto = req.body;
      logControllerMethod('UserController', 'completeSignup', LOGGER_MESSAGES.USER_CREATED, { email: body.email, name: body.name, ip: req.ip });
      
      const result = await userService.completeSignup(body.name, body.email, body.password);
      
      logControllerMethod('UserController', 'completeSignup', LOGGER_MESSAGES.USER_CREATED, { email: body.email, userId: result.userId });
      return res.status(HTTP_STATUS.CREATED).json(ResponseHelper.created(USER_MESSAGES.USER_CREATED, result));
    } catch (err: any) {
      logControllerError('UserController', 'completeSignup', err, { email: req.body?.email, ip: req.ip });
      return next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body: LoginUserDto = req.body;
      logControllerMethod('UserController', 'login', LOGGER_MESSAGES.LOGIN_ATTEMPT, { email: body.email, ip: req.ip });
      
      const result = await userService.login(body.email, body.password);
      
      logControllerMethod('UserController', 'login', LOGGER_MESSAGES.LOGIN_ATTEMPT, { email: body.email, userId: result.user.id });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.LOGIN_SUCCESS, result));
    } catch (err: any) {
      logControllerError('UserController', 'login', err, { email: req.body?.email, ip: req.ip });
      return next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body: ForgotPasswordDto = req.body;
      logControllerMethod('UserController', 'forgotPassword', LOGGER_MESSAGES.EMAIL_SENT, { email: body.email, ip: req.ip });
      
      const result = await userService.forgotPassword(body.email);
      
      logControllerMethod('UserController', 'forgotPassword', LOGGER_MESSAGES.EMAIL_SENT, { email: body.email, userId: result.userId });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.OTP_SENT, result));
    } catch (err: any) {
      logControllerError('UserController', 'forgotPassword', err, { email: req.body?.email, ip: req.ip });
      return next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body: ResetPasswordDto = req.body;
      logControllerMethod('UserController', 'resetPassword', LOGGER_MESSAGES.PASSWORD_UPDATED, { token: body.token, ip: req.ip });
      
      const result = await userService.resetPassword(body.token, body.newPassword, body.confirmPassword);
      
      logControllerMethod('UserController', 'resetPassword', LOGGER_MESSAGES.PASSWORD_UPDATED, { token: body.token });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.PASSWORD_RESET_SUCCESS, result));
    } catch (err: any) {
      logControllerError('UserController', 'resetPassword', err, { token: req.body?.token, ip: req.ip });
      return next(err);
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const body: ChangePasswordDto = req.body;
      logControllerMethod('UserController', 'changePassword', LOGGER_MESSAGES.PASSWORD_UPDATED, { userId: user._id, ip: req.ip });
      
      const result = await userService.changePassword(user._id, body.currentPassword, body.newPassword);
      
      logControllerMethod('UserController', 'changePassword', LOGGER_MESSAGES.PASSWORD_UPDATED, { userId: user._id });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.PASSWORD_CHANGED_SUCCESS, result));
    } catch (err: any) {
      logControllerError('UserController', 'changePassword', err, { userId: req.user?._id, ip: req.ip });
      return next(err);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      logControllerMethod('UserController', 'getProfile', LOGGER_MESSAGES.USER_FETCHED, { userId: user._id, ip: req.ip });
      const profile = await userService.getProfile(user._id);
      logControllerMethod('UserController', 'getProfile', LOGGER_MESSAGES.USER_FETCHED, { userId: user._id });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.PROFILE_FETCHED, profile));
    } catch (err: any) {
      logControllerError('UserController', 'getProfile', err, { userId: req.user?._id, ip: req.ip });
      return next(err);
    }
  }

  async editProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const body: UpdateUserDto = req.body;
      logControllerMethod('UserController', 'editProfile', LOGGER_MESSAGES.USER_FETCHED, { userId: user._id, updatedFields: Object.keys(body), ip: req.ip });
      
      const result = await userService.editProfile(user._id, body);
      
      logControllerMethod('UserController', 'editProfile', LOGGER_MESSAGES.USER_FETCHED, { userId: user._id, updatedFields: Object.keys(body) });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.PROFILE_UPDATED_SUCCESS, result));
    } catch (err: any) {
      logControllerError('UserController', 'editProfile', err, { userId: req.user?._id, ip: req.ip });
      return next(err);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      logControllerMethod('UserController', 'logout', LOGGER_MESSAGES.ADMIN_LOGOUT, { userId: user._id, ip: req.ip });
      
      const result = await userService.logout(user._id);
      
      logControllerMethod('UserController', 'logout', LOGGER_MESSAGES.ADMIN_LOGOUT, { userId: user._id });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.LOGOUT_SUCCESS, result));
    } catch (err: any) {
      logControllerError('UserController', 'logout', err, { userId: req.user?._id, ip: req.ip });
      return next(err);
    }
  }
}
