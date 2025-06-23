import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '../config/email.config';

const transporter = nodemailer.createTransport({
  service: EMAIL_CONFIG.SERVICE,
  port: EMAIL_CONFIG.PORT,
  secure: EMAIL_CONFIG.SECURE, // true for 465, false for other ports
  host: EMAIL_CONFIG.HOST,
  auth: {
    user: EMAIL_CONFIG.USER,
    pass: EMAIL_CONFIG.PASS,
  },
});

/**
 * Unified, reusable email sender
 */
export const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> => {
  await transporter.sendMail({
    from: EMAIL_CONFIG.FROM,
    to,
    subject,
    text,
  });
};
