// middlewares/basicAuth.ts
//
// publicBasicAuthMiddleware: Protects public/internal APIs using static credentials from environment variables.
// This middleware does NOT check the database. It is intended for endpoints like docs, seeding, or internal tools.
// Usage: Add as middleware to any route you want to protect with basic auth.

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { Admin } from '@models/admin.model';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import { USER_MESSAGES } from '@common/constants/userMessage';
import { AuthenticatedRequest } from './auth.middleware';

export class BasicAuth {
  /**
   * Middleware to protect public/internal APIs using HTTP Basic Auth.
   * Checks credentials against environment variables (BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD).
   * Does NOT check the database. Use for docs, seeding, or internal tools.
   */
  static public() {
    return (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
      }
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');
      const validUsername = process.env.BASIC_AUTH_USERNAME;
      const validPassword = process.env.BASIC_AUTH_PASSWORD;
      if (username === validUsername && password === validPassword) {
        return next();
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    };
  }

  /**
   * Middleware for admin login using Basic Auth against the Admin collection.
   */
  static admin() {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Missing or invalid Authorization header' });
      }
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [email, password] = credentials.split(':');
      if (!email || !password) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Missing email or password' });
      }
      try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
          return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: USER_MESSAGES.INVALID_CREDENTIALS });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: USER_MESSAGES.INVALID_CREDENTIALS });
        }
        if (!admin.isActive) {
          return res.status(HTTP_STATUS.FORBIDDEN).json({ message: USER_MESSAGES.ACCOUNT_INACTIVE });
        }
        req.user = admin;
        req.user.role = 'admin';
        next();
      } catch (err) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: USER_MESSAGES.INVALID_CREDENTIALS });
      }
    };
  }
}
