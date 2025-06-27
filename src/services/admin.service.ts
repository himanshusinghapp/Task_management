import bcrypt from 'bcrypt';
import { Admin } from '@models/admin.model';
import { User } from '@models/user.model';
import { generateToken } from '@utils/jwt.utils';
import { hashPassword } from '@common/helpers/hash';
import { USER_MESSAGES } from '@common/constants/userMessage';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';
import { logMessage } from '@utils/logger';
import { Exceptions } from '@common/exception/customException';
import { adminQuery,userQuery} from '@utils/query';

export class AdminService {
  async signup(name: string, email: string, password: string) {
    const existing = await adminQuery.findAdminByEmail(email);
    if (existing) throw Exceptions.BadRequest(USER_MESSAGES.ADMIN_EXISTS);

    const hashed = await hashPassword(password);
    const admin = await Admin.create({ name, email, password: hashed });

    logMessage('info', LOGGER_MESSAGES.ADMIN_CREATED, { adminId: admin._id });
    return { adminId: admin._id };
  }

  async login(email: string, password: string) {
    // console.log('Login email:', email);
    const admin = await adminQuery.findAdminByEmail(email);
    // console.log('Admin from DB:', admin);
    if (!admin) throw Exceptions.Unauthorized(USER_MESSAGES.INVALID_CREDENTIALS);

    // console.log('Login password:', password);
    // console.log('Stored hash:', admin.password);
    const isMatch = await bcrypt.compare(password, admin.password);
    // console.log('Password match:', isMatch);
    if (!isMatch) throw Exceptions.Unauthorized(USER_MESSAGES.INVALID_CREDENTIALS);

    const accessToken = generateToken(admin._id.toString(), 'admin');

    logMessage('info', LOGGER_MESSAGES.ADMIN_LOGIN_SUCCESS, { adminId: admin._id });
    return {
      accessToken,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    };
  }

  async getAllUsers() {
    const users = await adminQuery.findUsers();
    return users;
  }

  async blockUser(userId: string) {
    const user = await userQuery.findUserById(userId);
    if (!user) throw Exceptions.NotFound(USER_MESSAGES.USER_NOT_FOUND);

    await userQuery.updateUserById(userId, { isVerified: false });
    logMessage('warn', LOGGER_MESSAGES.ADMIN_BLOCK_USER, { userId });
    return { userId };
  }

  async unblockUser(userId: string) {
    const user = await userQuery.findUserById(userId);
    if (!user) throw Exceptions.NotFound(USER_MESSAGES.USER_NOT_FOUND);

    await userQuery.updateUserById(userId, { isVerified: true });
    logMessage('info', LOGGER_MESSAGES.ADMIN_UNBLOCK_USER, { userId });
    return { userId };
  }

  async searchUsers(query: string) {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phoneNumber: { $regex: query, $options: 'i' } },
      ],
    }).select('-password');
    return users;
  }

  async getProfile(adminId: string) {
    const admin = await adminQuery.findAdminById(adminId);
    if (!admin) throw Exceptions.NotFound(USER_MESSAGES.ADMIN_NOT_FOUND);
    return { id: admin._id, name: admin.name, email: admin.email, isActive: admin.isActive };
  }

  async logout(adminId: string) {
    const admin = await adminQuery.findAdminById(adminId);
    if (!admin) throw Exceptions.NotFound(USER_MESSAGES.ADMIN_NOT_FOUND);
    await Admin.updateOne({ _id: adminId }, { $set: { isActive: false } });
    return { adminId };
  }
}