import bcrypt from 'bcrypt';
import { hashPassword} from '@common/helpers';
import { USER_MESSAGES, OTP_EXPIRY, OTP_ATTEMPT_THRESHOLD, OTP_ATTEMPT_BLOCK_TIME, LOGGER_MESSAGES, ROLE  } from '@common/constants';
import { userQuery, logServiceMethod, logServiceError } from '@utils';
import { JwtUtil,EmailUtil,GeneratorUtil,RedisUtil } from '@utils';
import { Exceptions } from '@common/exception';
import { User } from '@models';

export class UserService {

  async requestEmailVerification(email: string) {
    try {
      logServiceMethod('UserService', 'requestEmailVerification', LOGGER_MESSAGES.EMAIL_SENT, { email });
      
      const existingUser = await userQuery.findUserByEmail(email);
      if (existingUser) {
        logServiceMethod('UserService', 'requestEmailVerification', LOGGER_MESSAGES.USER_CREATION_FAILED, { email });
        throw Exceptions.BadRequest(USER_MESSAGES.USER_EXISTS);
      }

      const otpKey = `otp:${email}`;
      const attemptKey = `otp:attempts:${email}`;
      const sentCount = Number(await RedisUtil.get(attemptKey)) || 0;

      if (sentCount >= OTP_ATTEMPT_THRESHOLD) {
        logServiceMethod('UserService', 'requestEmailVerification', LOGGER_MESSAGES.OTP_REQUEST_LIMIT, { email, attempts: sentCount });
        throw Exceptions.TooManyRequests(USER_MESSAGES.OTP_LIMIT_REACHED);
      }

      const otp = GeneratorUtil.generateOtp();
      await Promise.all([
        RedisUtil.set(otpKey, otp, 'EX', OTP_EXPIRY),
        RedisUtil.set(attemptKey, `${sentCount + 1}`, 'EX', OTP_ATTEMPT_BLOCK_TIME),
        EmailUtil.sendEmail({ to: email, subject: 'Email Verification', text: `Your OTP is: ${otp}` }),
      ]);

      logServiceMethod('UserService', 'requestEmailVerification', LOGGER_MESSAGES.EMAIL_SENT, { email, attempts: sentCount + 1 });
      return { message: USER_MESSAGES.OTP_SENT};
    } catch (error) {
      logServiceError('UserService', 'requestEmailVerification', error, { email });
      throw error;
    }
  }

  async verifyEmailOtp(email: string, otp: string) {
    try {
      logServiceMethod('UserService', 'verifyEmailOtp', LOGGER_MESSAGES.EMAIL_SENT, { email });
      
      const storedOtp = await RedisUtil.get(`otp:${email}`);
      if (!storedOtp ) {
        logServiceMethod('UserService', 'verifyEmailOtp', LOGGER_MESSAGES.OTP_REQUEST_LIMIT, { email });
        throw Exceptions.BadRequest(USER_MESSAGES.INVALID_OR_EXPIRED_OTP);
      }
      if(storedOtp !== otp){
        
      }
      

      await RedisUtil.del(`otp:${email}`);
      await RedisUtil.set(`verified:${email}`, 'true', 'EX', OTP_ATTEMPT_BLOCK_TIME); 

      logServiceMethod('UserService', 'verifyEmailOtp', LOGGER_MESSAGES.EMAIL_SENT, { email });
      return { message: USER_MESSAGES.EMAIL_VERIFIED };
    } catch (error) {
      logServiceError('UserService', 'verifyEmailOtp', error, { email });
      throw error;
    }
  }

  async completeSignup(name: string, email: string, password: string) {
    try {
      logServiceMethod('UserService', 'completeSignup', LOGGER_MESSAGES.USER_CREATED, { email });
      
      const isVerified = await RedisUtil.get(`verified:${email}`);
      if (!isVerified) {
        logServiceMethod('UserService', 'completeSignup', LOGGER_MESSAGES.USER_CREATION_FAILED, { email });
        throw Exceptions.BadRequest(USER_MESSAGES.EMAIL_NOT_VERIFIED);
      }

      const existingUser = await userQuery.findUserByEmail(email);
      if (existingUser) {
        logServiceMethod('UserService', 'completeSignup', LOGGER_MESSAGES.USER_CREATION_FAILED, { email });
        throw Exceptions.BadRequest(USER_MESSAGES.USER_EXISTS);
      }

      const hashedPassword = await hashPassword(password);
      const user = await User.create({ name, email, password: hashedPassword, isVerified: true });

      await RedisUtil.del(`verified:${email}`);
      
      logServiceMethod('UserService', 'completeSignup', LOGGER_MESSAGES.USER_CREATED, { email, userId: user._id });
      return { userId: user._id };
    } catch (error) {
      logServiceError('UserService', 'completeSignup', error, { email });
      throw error;
    }
  }

  async verifyEmail(userId: string, otp: string) {
    try {
      logServiceMethod('UserService', 'verifyEmail', LOGGER_MESSAGES.EMAIL_SENT, { userId });
      
      const storedOtp = await RedisUtil.get(`otp:${userId}`);
      if (!storedOtp) {
        logServiceMethod('UserService', 'verifyEmail', LOGGER_MESSAGES.OTP_REQUEST_LIMIT, { userId });
        throw Exceptions.BadRequest(USER_MESSAGES.OTP_EXPIRED);
      }
      if (storedOtp !== otp) {
        logServiceMethod('UserService', 'verifyEmail', LOGGER_MESSAGES.OTP_REQUEST_LIMIT, { userId });
        throw Exceptions.BadRequest(USER_MESSAGES.INVALID_OTP_);
      }

      await userQuery.updateUserById(userId, { isVerified: true });
      await RedisUtil.del(`otp:${userId}`);
      
      logServiceMethod('UserService', 'verifyEmail', LOGGER_MESSAGES.EMAIL_SENT, { userId });
      return { userId };
    } catch (error) {
      logServiceError('UserService', 'verifyEmail', error, { userId });
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      logServiceMethod('UserService', 'login', LOGGER_MESSAGES.LOGIN_ATTEMPT, { email });
      
      const user = await userQuery.findUserByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        logServiceMethod('UserService', 'login', LOGGER_MESSAGES.LOGIN_ATTEMPT, { email });
        throw Exceptions.Unauthorized(USER_MESSAGES.INVALID_CREDENTIALS);
      }
      
      if (!user.isVerified) {
        logServiceMethod('UserService', 'login', LOGGER_MESSAGES.USER_CREATION_FAILED, { email, userId: user._id });
        throw Exceptions.Forbidden(USER_MESSAGES.EMAIL_NOT_VERIFIED);
      }

      if(user.isBlocked){
        logServiceMethod('UserService', 'login', LOGGER_MESSAGES.USER_CREATION_FAILED, { email, userId: user._id });
        throw Exceptions.Forbidden(USER_MESSAGES.USER_BLOCKED);
      }
      
      await userQuery.updateUserById(user._id.toString(), { isActive: true });
      const accessToken = JwtUtil.generateToken(user._id.toString(), ROLE.USER);
      await RedisUtil.set(
        `session:user:${user._id}`,
        JSON.stringify({
          id: user._id,
          email: user.email,
          role: ROLE.USER,
          isActive: user.isActive,
        }),
      );
      logServiceMethod('UserService', 'login', LOGGER_MESSAGES.LOGIN_ATTEMPT, { email, userId: user._id });
      return {
        accessToken,
        user: { id: user._id, name: user.name, email: user.email },
      };
    } catch (error) {
      logServiceError('UserService', 'login', error, { email });
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      logServiceMethod('UserService', 'forgotPassword', LOGGER_MESSAGES.EMAIL_SENT, { email });
      
      const user = await userQuery.findUserByEmail(email);
      if (!user) {
        logServiceMethod('UserService', 'forgotPassword', LOGGER_MESSAGES.USER_CREATION_FAILED, { email });
        throw Exceptions.NotFound(USER_MESSAGES.USER_NOT_FOUND);
      }
      
      if (!user.isVerified) {
        logServiceMethod('UserService', 'forgotPassword', LOGGER_MESSAGES.USER_CREATION_FAILED, { email, userId: user._id });
        throw Exceptions.Forbidden(USER_MESSAGES.EMAIL_NOT_VERIFIED);
      }

      const attemptsKey = `otp:reset:attempts:${user._id}`;
      const sentCount = Number(await RedisUtil.get(attemptsKey)) || 0;
      if (sentCount >= OTP_ATTEMPT_THRESHOLD) {
        logServiceMethod('UserService', 'forgotPassword', LOGGER_MESSAGES.OTP_REQUEST_LIMIT, { userId: user._id, attempts: sentCount });
        throw Exceptions.TooManyRequests(USER_MESSAGES.OTP_LIMIT_REACHED);
      }

      const otp = GeneratorUtil.generateOtp();
      await Promise.all([
        RedisUtil.set(`otp:reset:${user._id}`, otp, 'EX', OTP_EXPIRY),
        RedisUtil.set(attemptsKey, String(sentCount + 1), 'EX', OTP_ATTEMPT_BLOCK_TIME),
        EmailUtil.sendEmail({ to: email, subject: 'Password Reset OTP', text: `Your OTP is: ${otp}` }),
      ]);

      logServiceMethod('UserService', 'forgotPassword', LOGGER_MESSAGES.EMAIL_SENT, { userId: user._id, attempts: sentCount + 1 });
      return { userId: user._id };
    } catch (error) {
      logServiceError('UserService', 'forgotPassword', error, { email });
      throw error;
    }
  }

  async resetPassword(userId: string, otp: string, newPassword: string) {
    try {
      logServiceMethod('UserService', 'resetPassword', LOGGER_MESSAGES.PASSWORD_UPDATED, { userId });
      
      const storedOtp = await RedisUtil.get(`otp:reset:${userId}`);
      const attemptsKey = `otp:reset:invalid:${userId}`;
      let attempts = Number(await RedisUtil.get(attemptsKey)) || 0;

      if (!storedOtp) {
        logServiceMethod('UserService', 'resetPassword', LOGGER_MESSAGES.OTP_REQUEST_LIMIT, { userId });
        throw Exceptions.BadRequest(USER_MESSAGES.OTP_EXPIRED);
      }

      if (storedOtp !== otp) {
        attempts += 1;
        await RedisUtil.set(attemptsKey, String(attempts), 'EX', OTP_EXPIRY);
        if (attempts >= 5) {
          await RedisUtil.del(`otp:reset:${userId}`);
          logServiceMethod('UserService', 'resetPassword', LOGGER_MESSAGES.OTP_REQUEST_LIMIT, { userId, attempts });
          throw Exceptions.TooManyRequests(USER_MESSAGES.TOO_MANY_ATTEMPTS);
        }
        logServiceMethod('UserService', 'resetPassword', LOGGER_MESSAGES.OTP_REQUEST_LIMIT, { userId, attempts });
        throw Exceptions.BadRequest(USER_MESSAGES.INVALID_OTP(attempts));
      }

      const hashed = await hashPassword(newPassword);
      await userQuery.updateUserById(userId, { password: hashed });

      await Promise.all([
        RedisUtil.del(`otp:reset:${userId}`),
        RedisUtil.del(attemptsKey),
        RedisUtil.del(`otp:reset:attempts:${userId}`),
      ]);

      logServiceMethod('UserService', 'resetPassword', LOGGER_MESSAGES.PASSWORD_UPDATED, { userId });
      return { userId };
    } catch (error) {
      logServiceError('UserService', 'resetPassword', error, { userId });
      throw error;
    }
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    try {
      logServiceMethod('UserService', 'changePassword', LOGGER_MESSAGES.PASSWORD_UPDATED, { userId });
      
      const user = await this.checkUser(userId);

      const isMatch = await bcrypt.compare(oldPass, user.password);
      if (!isMatch) {
        logServiceMethod('UserService', 'changePassword', LOGGER_MESSAGES.PASSWORD_UPDATED, { userId });
        throw Exceptions.BadRequest('Old password is incorrect');
      }

      const hashed = await hashPassword(newPass);
      await userQuery.updateUserById(userId, { password: hashed });

      logServiceMethod('UserService', 'changePassword', LOGGER_MESSAGES.PASSWORD_UPDATED, { userId });
      return { userId };
    } catch (error) {
      logServiceError('UserService', 'changePassword', error, { userId });
      throw error;
    }
  }

  async getProfile(userId: string) {
    try {
      logServiceMethod('UserService', 'getProfile', LOGGER_MESSAGES.USER_FETCHED, { userId });
      
      const user = await User.findById(userId).select('-password').lean();
      if (!user) {
        logServiceMethod('UserService', 'getProfile', LOGGER_MESSAGES.USER_CREATION_FAILED, { userId });
        throw Exceptions.NotFound(USER_MESSAGES.USER_NOT_FOUND);
      }
      
      logServiceMethod('UserService', 'getProfile', LOGGER_MESSAGES.USER_FETCHED, { userId });
      return { id: user._id, name: user.name, email: user.email, isActive: user.isActive, isVerified: user.isVerified };
    } catch (error) {
      logServiceError('UserService', 'getProfile', error, { userId });
      throw error;
    }
  }

  async editProfile(userId: string, data: { name?: string; email?: string }) {
    try {
      logServiceMethod('UserService', 'editProfile', LOGGER_MESSAGES.USER_FETCHED, { userId, data });
      
      const user = await this.checkUser(userId);
      if (data.email && data.email !== user.email) {
        const emailExists = await userQuery.findUserByEmail(data.email);
        if (emailExists) {
          logServiceMethod('UserService', 'editProfile', LOGGER_MESSAGES.USER_CREATION_FAILED, { userId, newEmail: data.email });
          throw Exceptions.BadRequest(USER_MESSAGES.EMAIL_ALREADY_IN_USE);
        }
      }

      await userQuery.updateUserById(userId, {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
      });

      logServiceMethod('UserService', 'editProfile', LOGGER_MESSAGES.USER_FETCHED, { userId, updatedFields: Object.keys(data) });
      return { userId };
    } catch (error) {
      logServiceError('UserService', 'editProfile', error, { userId, data });
      throw error;
    }
  }

  async logout(userId: string) {
    try {
      logServiceMethod('UserService', 'logout', LOGGER_MESSAGES.ADMIN_LOGOUT, { userId });
      
      const user = await this.checkUser(userId);
      await userQuery.updateUserById(user._id.toString(), { isActive: false });
      await RedisUtil.del(`session:user:${userId}`);

      
      logServiceMethod('UserService', 'logout', LOGGER_MESSAGES.ADMIN_LOGOUT, { userId });
      return { userId };
    } catch (error) {
      logServiceError('UserService', 'logout', error, { userId });
      throw error;
    }
  }

  async checkUser(userId:string){
    try {
      const user = await userQuery.findUserById(userId);
      if (!user) {
        logServiceMethod('UserService', 'checkUser', LOGGER_MESSAGES.USER_CREATION_FAILED, { userId });
        throw Exceptions.NotFound(USER_MESSAGES.USER_NOT_FOUND);
      }
      if(user.isBlocked){
        logServiceMethod('UserService', 'checkUser', LOGGER_MESSAGES.USER_CREATION_FAILED, { userId });
        throw Exceptions.Forbidden(USER_MESSAGES.USER_BLOCKED);
      }
      return user;
    } catch (error) {
      logServiceError('UserService', 'checkUser', error, { userId });
      throw error;
    }
  }
}
