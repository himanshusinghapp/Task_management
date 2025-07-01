import { Request, Response, NextFunction } from 'express';
export class BasicAuth {

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
}
