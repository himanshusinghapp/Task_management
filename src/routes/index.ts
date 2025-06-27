import { Router } from 'express';
import authRoutes from './user.route';
import adminRoutes from './admin.routes';
import taskRoutes from './task.routes';
import projectRoutes from './project.routes';
import commentRoutes from './comment.routes';
const router = Router();

router.use('/user', authRoutes);
router.use('/admin',adminRoutes);
router.use('/tasks',taskRoutes);
router.use('/project',projectRoutes);
router.use('/comments',commentRoutes);

export default router;