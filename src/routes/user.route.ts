import { Router } from 'express';
import { AuthController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const controller = new AuthController();

// 📂 Public Routes
router.post('/signup', controller.signup.bind(controller));
router.post('/resend-otp', controller.resendOtp.bind(controller));
router.post('/verify-email', controller.verifyEmail.bind(controller));
router.post('/login', controller.login.bind(controller));
router.post('/forgot-password', controller.forgotPassword.bind(controller));
router.post('/reset-password', controller.resetPassword.bind(controller));

// 🔐 Protected Routes
router.get('/profile', authenticate('user'), controller.getProfile.bind(controller));
router.put('/profile', authenticate('user'), controller.editProfile.bind(controller));
router.post('/change-password', authenticate('user'), controller.changePassword.bind(controller));
router.delete('/logout', authenticate('user'), controller.logout.bind(controller));

export default router;
