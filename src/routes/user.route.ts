import { Router } from 'express';
import { AuthController } from '@controllers/user.controller';
import { authenticate } from '@middlewares/auth.middleware';

const router = Router();
const controller = new AuthController();

router.post('/signup', controller.signup);
router.post('/resend-otp', controller.resendOtp);
router.post('/verify-email', controller.verifyEmail);
router.post('/login', controller.login);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

router.get('/profile', authenticate('user'), controller.getProfile);
router.put('/profile', authenticate('user'), controller.editProfile);
router.post('/change-password', authenticate('user'), controller.changePassword);
router.delete('/logout', authenticate('user'), controller.logout);

export default router;
