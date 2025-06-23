import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const controller = new AdminController();

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.get('/profile', authenticate('admin'), controller.getProfile);
router.delete('/logout', authenticate('admin'), controller.logout);
router.get('/users', authenticate('admin'), controller.getAllUsers);
router.patch('/block/:userId', authenticate('admin'), controller.blockUser);
router.patch('/unblock/:userId', authenticate('admin'), controller.unblockUser);
router.get('/search', authenticate('admin'), controller.searchUsers);

export default router;