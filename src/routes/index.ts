import { Router } from 'express';
import userRoutes from './user.route';
import adminRoutes from './admin.routes';
import taskRoutes from './task.routes';
import projectRoutes from './project.routes';
import commentRoutes from './comment.routes';

class RouteRegistry {
 static getRouter() {
    const router = Router();
    router.use('/user', userRoutes);
    router.use('/admin', adminRoutes);
    router.use('/tasks', taskRoutes);
    router.use('/project', projectRoutes);
    router.use('/comments', commentRoutes);
    return router;
  }
}

export default RouteRegistry;
export const router = RouteRegistry.getRouter();