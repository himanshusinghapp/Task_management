import { Router } from 'express';
import { TaskController } from '@controllers/task.controller';
import { authenticate } from '@middlewares/auth.middleware';
import { upload } from '@utils/multer';

const router = Router();
const controller = new TaskController();

router.post('/', authenticate('admin'), controller.createTask); // Only admin can create

router.get('/', authenticate('user'), controller.getAllTasks); // Admin sees all, user sees assigned
router.get('/:taskId', authenticate('user'), controller.getTaskById);
router.put('/:taskId', authenticate('user'), controller.updateTask);
router.delete('/:taskId', authenticate('user'), controller.deleteTask);

// router.post('/:taskId/attachments', authenticate('user'), controller.uploadAttachments);
router.post(
  '/:taskId/attachments',
  authenticate('user'),
  upload.array('attachments'), // form-data field should be named `attachments`
  controller.uploadAttachments,
);

router.get('/filter/by-label/:label', authenticate('user'), controller.getTasksByLabel);
router.get('/filter/by-date/:month/:year', authenticate('user'), controller.filterTasksByMonthYear);

export default router;
