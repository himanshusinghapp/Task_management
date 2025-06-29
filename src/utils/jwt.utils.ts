// Utility functions for handling JWT (JSON Web Token) operations
import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token for a user or admin.
 * @param id - The user's or admin's unique identifier.
 * @param role - The role of the user ('user' or 'admin').
 * @returns A signed JWT token valid for 7 days.
 */
export const generateToken = (id: string, role: 'user' | 'admin') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};
