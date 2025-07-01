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
  static authenticate(allowedRoles: ROLE.USER | ROLE.ADMIN) {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return res.status(401).json({ message:USER_MESSAGES.INVALID_TOKEN});
    }

    const userId = decoded.id;
    const redisKey = `session:user:${userId}`;

    try {
      const cachedUser = await RedisUtil.get(redisKey);
      if (!cachedUser) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USER_MESSAGES.SESSION_EXPIRED });
      }

      const user = JSON.parse(cachedUser);
      if (!user.isActive) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USER_MESSAGES.USER_INACTIVE });
      }

      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({ message: USER_MESSAGES.ACCESS_DENIED });
      }

      req.user = user; // attach to request
      next();
    } catch (err) {
      console.error('Redis error:', err);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: USER_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };
}
}