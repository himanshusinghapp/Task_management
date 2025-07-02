import { HTTP_STATUS, USER_MESSAGES } from '@/common/constants';
import { Request, Response, NextFunction } from 'express';
export class BasicAuth {

  static public() {
    return (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Basic ')) {
        return res.status(401).json({ message: USER_MESSAGES.TOKEN_MISSING  });
      }
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');
      const validUsername = process.env.BASIC_AUTH_USERNAME;
      const validPassword = process.env.BASIC_AUTH_PASSWORD;
      if (username === validUsername && password === validPassword) {
        return next();
      }
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message:USER_MESSAGES.INVALID_TOKEN });
    };
  }
}
