import { ROLE } from '@/common/constants';
import jwt from 'jsonwebtoken';

export class JwtUtil {
  static generateToken(id: string, role: ROLE.USER| ROLE.ADMIN) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  }
}
