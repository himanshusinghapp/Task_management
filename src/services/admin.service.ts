import bcrypt from 'bcrypt';
import { Admin } from '../models/admin.model';
import { User } from '../models/user.model';
import { generateToken } from '../utils/jwt.utils';
import { hashPassword } from '../common/hash';
import { USER_MESSAGES } from '../common/constants/userMessage';
import { LOGGER_MESSAGES } from '../common/constants/logger.constant';
import { logMessage } from '../utils/logger';
import { Exceptions } from '../common/customException';
import { findAdminByEmail, findAdminById, updateAdminById, findUserById, updateUserById, findUsers } from '../utils/query';

export class AdminService {
  async signup(name: string, email: string, password: string) {
    const existing = await findAdminByEmail(email);
    if (existing) throw Exceptions.BadRequest(USER_MESSAGES.ADMIN_EXISTS);

    const hashed = await hashPassword(password);
    const admin = await Admin.create({ name, email, password: hashed });

    logMessage('info', LOGGER_MESSAGES.ADMIN_CREATED, { adminId: admin._id });
    return {  message: USER_MESSAGES.ADMIN_CREATED };
  }

  async login(email: string, password: string) {
    const admin = await findAdminByEmail(email);
    if (!admin) throw Exceptions.Unauthorized(USER_MESSAGES.INVALID_CREDENTIALS);

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw Exceptions.Unauthorized(USER_MESSAGES.INVALID_CREDENTIALS);

    const accessToken = generateToken(admin._id.toString(), 'admin');

    logMessage('info', LOGGER_MESSAGES.ADMIN_LOGIN_SUCCESS, { adminId: admin._id });
    return {
      message: USER_MESSAGES.LOGIN_SUCCESS,
      accessToken,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    };
  }

  async getAllUsers() {
    const users = await findUsers();
    return { message: USER_MESSAGES.USER_FETCH_SUCCESS, users };
  }

  async blockUser(userId: string) {
    const user = await findUserById(userId);
    if (!user) throw Exceptions.NotFound(USER_MESSAGES.USER_NOT_FOUND);

    await updateUserById(userId, { isActive: false });
    logMessage('warn', LOGGER_MESSAGES.ADMIN_BLOCK_USER, { userId });
    return { message: USER_MESSAGES.USER_BLOCKED };
  }

  async unblockUser(userId: string) {
    const user = await findUserById(userId);
    if (!user) throw Exceptions.NotFound(USER_MESSAGES.USER_NOT_FOUND);

    await updateUserById(userId, { isActive: true });
    logMessage('info', LOGGER_MESSAGES.ADMIN_UNBLOCK_USER, { userId });
    return { message: USER_MESSAGES.USER_UNBLOCKED };
  }

  async searchUsers(query: string) {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phoneNumber: { $regex: query, $options: 'i' } },
      ],
    }).select('-password');
    return { message: USER_MESSAGES.USER_SEARCH_SUCCESS, users };
  }

  async getProfile(adminId: string) {
    const admin = await findAdminById(adminId);
    if (!admin) throw Exceptions.NotFound(USER_MESSAGES.ADMIN_NOT_FOUND);
    return admin;
  }

  async logout(adminId: string) {
    const admin = await findAdminById(adminId);
    if (!admin) throw Exceptions.NotFound(USER_MESSAGES.ADMIN_NOT_FOUND);
}
}