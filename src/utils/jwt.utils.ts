// Utility functions for handling JWT (JSON Web Token) operations
import jwt from 'jsonwebtoken';

export class JwtUtil {
  static generateToken(id: string, role: 'user' | 'admin') {
    return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  }
}
