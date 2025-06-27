import bcrypt from 'bcrypt';
import { redis } from '@utils/reddis';
import { hashPassword } from '@common/helpers/hash';
import { generateOtp } from '@utils/generator.utils';
import { sendEmail } from '@utils/email';
import { generateToken } from '@utils/jwt.utils';
import { USER_MESSAGES } from '@common/constants/userMessage';
import { OTP_EXPIRY, OTP_ATTEMPT_THRESHOLD, OTP_ATTEMPT_BLOCK_TIME } from '@common/constants/user.constant';
import { logMessage } from '@utils/logger';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';
import { userQuery } from '@utils/query';
import { Exceptions } from '@common/exception/customException';
import { User } from '@models/user.model';

export class UserService {
  // async signup(name: string, email: string, password: string) {
  //   const existing = await userQuery.findUserByEmail(email);
  //   if (existing) throw Exceptions.BadRequest(USER_MESSAGES.USER_EXISTS);

  //   const hashed = await hashPassword(password);
  //   const user = await User.create({ name, email, password: hashed });

  //   const otp = generateOtp();
  //   await redis.set(`otp:${user._id}`, otp, 'EX', OTP_EXPIRY);
  //   await sendEmail({ to: email, subject: 'OTP Verification', text: `Your OTP is: ${otp}` });

  //   logMessage('info', LOGGER_MESSAGES.USER_CREATED, { userId: user._id });
  //   return { userId: user._id };
  // }

  // async resendOtp(userId: string) {
  //   const user = await this.checkUser(userId);
  //   if (user.isVerified) throw Exceptions.BadRequest(USER_MESSAGES.EMAIL_ALREADY_VERIFIED);

  //   const attemptsKey = `otp:attempts:${userId}`;
  //   const sentCount = Number(await redis.get(attemptsKey)) || 0;
  //   if (sentCount >= OTP_ATTEMPT_THRESHOLD) {
  //     logMessage('warn', LOGGER_MESSAGES.OTP_REQUEST_LIMIT, { userId });
  //     throw Exceptions.TooManyRequests(USER_MESSAGES.OTP_LIMIT_REACHED);
  //   }

  //   const otp = generateOtp();
  //   await Promise.all([
  //     redis.set(`otp:${userId}`, otp, 'EX', OTP_EXPIRY),
  //     redis.set(attemptsKey, String(sentCount + 1), 'EX', OTP_ATTEMPT_BLOCK_TIME),
  //     sendEmail({ to: user.email, subject: 'OTP Verification', text: `Your OTP is: ${otp}` })
  //   ]);

  //   return { userId };
  // }

  async requestEmailVerification(email: string) {
  const existingUser = await userQuery.findUserByEmail(email);
  if (existingUser) throw Exceptions.BadRequest(USER_MESSAGES.USER_EXISTS);

  const otpKey = `otp:${email}`;
  const attemptKey = `otp:attempts:${email}`;
  const sentCount = Number(await redis.get(attemptKey)) || 0;

  if (sentCount >= OTP_ATTEMPT_THRESHOLD)
    throw Exceptions.TooManyRequests(USER_MESSAGES.OTP_LIMIT_REACHED);

  const otp = generateOtp();
  await Promise.all([
    redis.set(otpKey, otp, 'EX', OTP_EXPIRY),
    redis.set(attemptKey, `${sentCount + 1}`, 'EX', OTP_ATTEMPT_BLOCK_TIME),
    sendEmail({ to: email, subject: 'Email Verification', text: `Your OTP is: ${otp}` }),
  ]);

  return { message: 'OTP sent to your email.' };
}
async verifyEmailOtp(email: string, otp: string) {
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp || storedOtp !== otp)
    throw Exceptions.BadRequest(USER_MESSAGES.INVALID_OR_EXPIRED_OTP);

  await redis.del(`otp:${email}`);
  await redis.set(`verified:${email}`, 'true', 'EX', 900); // valid for 15 minutes

  return { message: 'Email verified. You can now sign up.' };
}
async completeSignup(name: string, email: string, password: string) {
  const isVerified = await redis.get(`verified:${email}`);
  if (!isVerified) throw Exceptions.BadRequest(USER_MESSAGES.EMAIL_NOT_VERIFIED);

  const existingUser = await userQuery.findUserByEmail(email);
  if (existingUser) throw Exceptions.BadRequest(USER_MESSAGES.USER_EXISTS);

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword, isVerified: true });

  await redis.del(`verified:${email}`);
  return { userId: user._id };
}


  async verifyEmail(userId: string, otp: string) {
    const storedOtp = await redis.get(`otp:${userId}`);
    if (!storedOtp || storedOtp !== otp) throw Exceptions.BadRequest(USER_MESSAGES.OTP_EXPIRED);

    await userQuery.updateUserById(userId, { isVerified: true });
    await redis.del(`otp:${userId}`);
    return { userId };
  }

  async login(email: string, password: string) {
    const user = await userQuery.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw Exceptions.Unauthorized(USER_MESSAGES.INVALID_CREDENTIALS);
    }
    if (!user.isVerified) throw Exceptions.Forbidden(USER_MESSAGES.EMAIL_NOT_VERIFIED);
    await userQuery.updateUserById(user._id.toString(), { isActive: true });
    const accessToken = generateToken(user._id.toString(), 'user');
    return {
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    };
  }

  async forgotPassword(email: string) {
    const user = await userQuery.findUserByEmail(email);
    if (!user) throw Exceptions.NotFound(USER_MESSAGES.USER_NOT_FOUND);
    if (!user.isVerified) throw Exceptions.Forbidden(USER_MESSAGES.EMAIL_NOT_VERIFIED);

    const attemptsKey = `otp:reset:attempts:${user._id}`;
    const sentCount = Number(await redis.get(attemptsKey)) || 0;
    if (sentCount >= OTP_ATTEMPT_THRESHOLD)
      throw Exceptions.TooManyRequests(USER_MESSAGES.OTP_LIMIT_REACHED);

    const otp = generateOtp();
    await Promise.all([
      redis.set(`otp:reset:${user._id}`, otp, 'EX', OTP_EXPIRY),
      redis.set(attemptsKey, String(sentCount + 1), 'EX', OTP_ATTEMPT_BLOCK_TIME),
      sendEmail({ to: email, subject: 'Password Reset OTP', text: `Your OTP is: ${otp}` }),
    ]);

    return { userId: user._id };
  }

  async resetPassword(userId: string, otp: string, newPassword: string) {
    const storedOtp = await redis.get(`otp:reset:${userId}`);
    const attemptsKey = `otp:reset:invalid:${userId}`;
    let attempts = Number(await redis.get(attemptsKey)) || 0;

    if (!storedOtp) throw Exceptions.BadRequest(USER_MESSAGES.OTP_EXPIRED);

    if (storedOtp !== otp) {
      attempts += 1;
      await redis.set(attemptsKey, String(attempts), 'EX', OTP_EXPIRY);
      if (attempts >= 5) {
        await redis.del(`otp:reset:${userId}`);
        throw Exceptions.TooManyRequests(USER_MESSAGES.TOO_MANY_ATTEMPTS);
      }
      throw Exceptions.BadRequest(USER_MESSAGES.INVALID_OTP(attempts));
    }

    const hashed = await hashPassword(newPassword);
    await userQuery.updateUserById(userId, { password: hashed });

    await Promise.all([
      redis.del(`otp:reset:${userId}`),
      redis.del(attemptsKey),
      redis.del(`otp:reset:attempts:${userId}`),
    ]);

    return { userId };
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await this.checkUser(userId);

    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) throw Exceptions.BadRequest('Old password is incorrect');

    const hashed = await hashPassword(newPass);
    await userQuery.updateUserById(userId, { password: hashed });

    return { userId };
  }

  async getProfile(userId: string) {
    const user = await User.findById(userId).select('-password').lean();
    if (!user) throw Exceptions.NotFound(USER_MESSAGES.USER_NOT_FOUND);
    return { id: user._id, name: user.name, email: user.email, isActive: user.isActive, isVerified: user.isVerified };
  }

  async editProfile(userId: string, data: { name?: string; email?: string }) {
    const user = await this.checkUser(userId);
    if (data.email && data.email !== user.email) {
      const emailExists = await userQuery.findUserByEmail(data.email);
      if (emailExists) throw Exceptions.BadRequest(USER_MESSAGES.EMAIL_ALREADY_IN_USE);
    }

    await userQuery.updateUserById(userId, {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
    });

    return { userId };
  }

  async logout(userId: string) {
    const user = await this.checkUser(userId);
    await userQuery.updateUserById(userId, { isActive: false });
    return { userId };
  }

  async checkUser(userId:string){
    const user = await userQuery.findUserById(userId);
    if (!user) throw Exceptions.NotFound(USER_MESSAGES.USER_NOT_FOUND);
    return user;
  }
}
