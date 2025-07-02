import dotenv from 'dotenv';
dotenv.config();
export const EMAIL_CONFIG = {
  SERVICE: 'gmail',
  FROM: process.env.EMAIL_FROM ?? '',
  USER: process.env.EMAIL_USER ?? '',
  PASS: process.env.EMAIL_PASS ?? '',
  HOST: process.env.EMAIL_HOST ?? 'smtp.gmail.com',
  PORT: parseInt(process.env.EMAIL_PORT ?? '587', 10),
  SECURE: process.env.EMAIL_SECURE === 'true', // true for 465,
};
