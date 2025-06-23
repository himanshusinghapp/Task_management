import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@models/user.model';
import { Admin } from '@models/admin.model';
import dotenv from 'dotenv';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import {USER_MESSAGES} from '@common/constants/userMessage';


dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: any;
}


export const authenticate = (type: 'user' | 'admin') => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token)
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: USER_MESSAGES.UNAUTHORIZED });

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      const Model = type === 'user' ? User : Admin;
      const user = await (Model as typeof User).findById(decoded.id);

      if (!user)
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: USER_MESSAGES.USER_NOT_FOUND });

      if (!user.isActive)
        return res.status(HTTP_STATUS.FORBIDDEN).json({ message: USER_MESSAGES.ACCOUNT_INACTIVE });

      if (decoded.role !== type)
        return res.status(HTTP_STATUS.FORBIDDEN).json({ message: USER_MESSAGES.ROLE_MISMATCH });

      req.user = user;
      req.user.role = decoded.role;
      next();
    } catch (err) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: USER_MESSAGES.INVALID_TOKEN });
    }
  };
};