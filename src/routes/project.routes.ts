import { Router } from 'express';
import { ProjectController } from '@controllers/project.controller';
import { authenticate } from '@middlewares/auth.middleware';

const router = Router();
const controller = new ProjectController();

router.post('/', authenticate('admin'), (req, res) => controller.createProject(req, res));
router.patch('/:projectId', authenticate('admin'), (req, res) => controller.updateProject(req, res));
router.delete('/:projectId', authenticate('admin'), (req, res) => controller.deleteProject(req, res));
router.post('/:projectId/assign-members', authenticate('admin'), (req, res) => controller.assignMembers(req, res));
router.patch('/:projectId/remove-members', authenticate('admin'), (req, res) => controller.removeMembers(req, res));
router.post('/:projectId/assign-tasks', authenticate('admin'), (req, res) => controller.assignTasks(req, res));
router.patch('/:projectId/remove-tasks', authenticate('admin'), (req, res) => controller.removeTasks(req, res));
router.get('/', authenticate('admin'), (req, res) => controller.getProjects(req, res));

export default router;
