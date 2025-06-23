import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const controller = new ProjectController();

router.post('/', authenticate('admin'), (req, res) => controller.createProject(req, res));
router.post('/:projectId/assign-members', authenticate('admin'), (req, res) => controller.assignMembers(req, res));
router.post('/:projectId/assign-tasks', authenticate('admin'), (req, res) => controller.assignTasks(req, res));
router.get('/', authenticate('admin'), (req, res) => controller.getProjects(req, res));

export default router;
