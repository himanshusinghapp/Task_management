import jwt from 'jsonwebtoken';

export const generateToken = (id: string, role: 'user' | 'admin') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};
