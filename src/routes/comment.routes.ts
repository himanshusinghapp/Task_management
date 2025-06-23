import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const commentController = new CommentController();
const router = Router();

// User must be authenticated
router.post('/', authenticate('user'), (req, res) => commentController.addComment(req, res));
router.get('/task/:taskId', authenticate('user'), (req, res) => commentController.getCommentsByTask(req, res));
router.put('/:commentId', authenticate('user'), (req, res) => commentController.updateComment(req, res));
router.delete('/:commentId', authenticate('user'), (req, res) => commentController.deleteComment(req, res));
router.get('/user/:userId', authenticate('user'), (req, res) => commentController.getCommentsByUser(req, res));
router.get('/task/:taskId/user/:userId', authenticate('user'), (req, res) => commentController.getCommentsByTaskAndUser(req, res));
router.get('/', authenticate('user'), (req, res) => commentController.getAllComments(req, res));

export default router;
