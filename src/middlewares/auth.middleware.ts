import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, Admin } from '@models';
import dotenv from 'dotenv';
import {USER_MESSAGES,HTTP_STATUS,ROLE} from '@common/constants';
import { RedisUtil } from '@utils/reddis';

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export class Auth {
  static authenticate(allowedRoles: ROLE[]) {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: USER_MESSAGES.TOKEN_MISSING });
      }

      const token = authHeader.split(' ')[1];
      let decoded: any;

      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!);
      } catch (err) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message:USER_MESSAGES.INVALID_TOKEN});
      }

      const userId = decoded.id;
      const userRole = decoded.role;
      const redisKey = `session:user:${userId}`;

      try {
        let cachedUser = await RedisUtil.get(redisKey);
        let user;
        if (cachedUser) {
          user = JSON.parse(cachedUser);
        } else {
          if (userRole === ROLE.ADMIN) {
            user = await Admin.findById(userId).lean();
          } else {
            user = await User.findById(userId).lean();
          }
          if (!user) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USER_MESSAGES.SESSION_EXPIRED });
          }
          if (!user._id) {
            console.error('User object missing _id before caching:', user);
          }
          await RedisUtil.set(redisKey, JSON.stringify(user));
        }

        if (!user.isActive) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USER_MESSAGES.USER_INACTIVE });
        }

        if (
          (Array.isArray(allowedRoles) && !allowedRoles.includes(user.role)) ||
          (!Array.isArray(allowedRoles) && allowedRoles !== user.role)
        ) {
          return res.status(HTTP_STATUS.FORBIDDEN).json({ message: USER_MESSAGES.ACCESS_DENIED });
        }

        req.user = user; 
        next();
      } catch (err) {
        console.error('Redis/DB error:', err);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: USER_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    };
  }
}