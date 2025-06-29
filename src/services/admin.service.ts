import bcrypt from 'bcrypt';
import { Admin } from '@models/admin.model';
import { User } from '@models/user.model';
import { generateToken } from '@utils/jwt.utils';
import { hashPassword } from '@common/helpers/hash';
import { USER_MESSAGES } from '@common/constants/userMessage';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';
import { logServiceMethod, logServiceError } from '@utils/logger';
import { Exceptions } from '@common/exception/customException';
import { adminQuery,userQuery} from '@utils/query';

export class AdminService {
  async signup(name: string, email: string, password: string) {
    try {
      logServiceMethod('AdminService', 'signup', LOGGER_MESSAGES.ADMIN_CREATED, { email });
      
      const existing = await adminQuery.findAdminByEmail(email);
      if (existing) {
        logServiceMethod('AdminService', 'signup', LOGGER_MESSAGES.ADMIN_SIGNUP_FAILED, { email });
        throw Exceptions.BadRequest(USER_MESSAGES.ADMIN_EXISTS);
      }

      const hashed = await hashPassword(password);
      const admin = await Admin.create({ name, email, password: hashed });

      logServiceMethod('AdminService', 'signup', LOGGER_MESSAGES.ADMIN_CREATED, { adminId: admin._id, email });
      return { adminId: admin._id };
    } catch (error) {
      logServiceError('AdminService', 'signup', error, { email });
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      logServiceMethod('AdminService', 'login', LOGGER_MESSAGES.ADMIN_LOGIN_SUCCESS, { email });
      
      const admin = await adminQuery.findAdminByEmail(email);
      if (!admin) {
        logServiceMethod('AdminService', 'login', LOGGER_MESSAGES.ADMIN_LOGIN_FAILED, { email });
        throw Exceptions.Unauthorized(USER_MESSAGES.INVALID_CREDENTIALS);
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        logServiceMethod('AdminService', 'login', LOGGER_MESSAGES.ADMIN_LOGIN_FAILED, { email });
        throw Exceptions.Unauthorized(USER_MESSAGES.INVALID_CREDENTIALS);
      }

      const accessToken = generateToken(admin._id.toString(), 'admin');

      logServiceMethod('AdminService', 'login', LOGGER_MESSAGES.ADMIN_LOGIN_SUCCESS, { adminId: admin._id, email });
      return {
        accessToken,
        admin: { id: admin._id, name: admin.name, email: admin.email },
      };
    } catch (error) {
      logServiceError('AdminService', 'login', error, { email });
      throw error;
    }
  }

  async getAllUsers() {
    try {
      logServiceMethod('AdminService', 'getAllUsers', LOGGER_MESSAGES.USER_FETCHED);
      
      const users = await adminQuery.findUsers();
      
      logServiceMethod('AdminService', 'getAllUsers', LOGGER_MESSAGES.USER_FETCHED, { count: users.length });
      return users;
    } catch (error) {
      logServiceError('AdminService', 'getAllUsers', error);
      throw error;
    }
  }

  async blockUser(userId: string) {
    try {
      logServiceMethod('AdminService', 'blockUser', LOGGER_MESSAGES.ADMIN_BLOCK_USER, { userId });
      
      const user = await userQuery.findUserById(userId);
      if (!user) {
        logServiceMethod('AdminService', 'blockUser', LOGGER_MESSAGES.USER_CREATION_FAILED, { userId });
        throw Exceptions.NotFound(USER_MESSAGES.USER_NOT_FOUND);
      }

      await userQuery.updateUserById(userId, { isVerified: false });
      
      logServiceMethod('AdminService', 'blockUser', LOGGER_MESSAGES.ADMIN_BLOCK_USER, { userId });
      return { userId };
    } catch (error) {
      logServiceError('AdminService', 'blockUser', error, { userId });
      throw error;
    }
  }

  async unblockUser(userId: string) {
    try {
      logServiceMethod('AdminService', 'unblockUser', LOGGER_MESSAGES.ADMIN_UNBLOCK_USER, { userId });
      
      const user = await userQuery.findUserById(userId);
      if (!user) {
        logServiceMethod('AdminService', 'unblockUser', LOGGER_MESSAGES.USER_CREATION_FAILED, { userId });
        throw Exceptions.NotFound(USER_MESSAGES.USER_NOT_FOUND);
      }

      await userQuery.updateUserById(userId, { isVerified: true });
      
      logServiceMethod('AdminService', 'unblockUser', LOGGER_MESSAGES.ADMIN_UNBLOCK_USER, { userId });
      return { userId };
    } catch (error) {
      logServiceError('AdminService', 'unblockUser', error, { userId });
      throw error;
    }
  }

  async searchUsers(query: string) {
    try {
      logServiceMethod('AdminService', 'searchUsers', LOGGER_MESSAGES.USER_FETCHED, { query });
      
      const users = await User.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { phoneNumber: { $regex: query, $options: 'i' } },
        ],
      }).select('-password');
      
      logServiceMethod('AdminService', 'searchUsers', LOGGER_MESSAGES.USER_FETCHED, { query, count: users.length });
      return users;
    } catch (error) {
      logServiceError('AdminService', 'searchUsers', error, { query });
      throw error;
    }
  }

  async getProfile(adminId: string) {
    try {
      logServiceMethod('AdminService', 'getProfile', LOGGER_MESSAGES.USER_FETCHED, { adminId });
      
      const admin = await adminQuery.findAdminById(adminId);
      if (!admin) {
        logServiceMethod('AdminService', 'getProfile', LOGGER_MESSAGES.ADMIN_LOGIN_FAILED, { adminId });
        throw Exceptions.NotFound(USER_MESSAGES.ADMIN_NOT_FOUND);
      }
      
      logServiceMethod('AdminService', 'getProfile', LOGGER_MESSAGES.USER_FETCHED, { adminId });
      return { id: admin._id, name: admin.name, email: admin.email, isActive: admin.isActive };
    } catch (error) {
      logServiceError('AdminService', 'getProfile', error, { adminId });
      throw error;
    }
  }

  async logout(adminId: string) {
    try {
      logServiceMethod('AdminService', 'logout', LOGGER_MESSAGES.ADMIN_LOGOUT, { adminId });
      
      const admin = await adminQuery.findAdminById(adminId);
      if (!admin) {
        logServiceMethod('AdminService', 'logout', LOGGER_MESSAGES.ADMIN_LOGIN_FAILED, { adminId });
        throw Exceptions.NotFound(USER_MESSAGES.ADMIN_NOT_FOUND);
      }
      
      await Admin.updateOne({ _id: adminId }, { $set: { isActive: false } });
      
      logServiceMethod('AdminService', 'logout', LOGGER_MESSAGES.ADMIN_LOGOUT, { adminId });
      return { adminId };
    } catch (error) {
      logServiceError('AdminService', 'logout', error, { adminId });
      throw error;
    }
  }
}