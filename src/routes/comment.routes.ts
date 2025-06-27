import { Router } from 'express';
import { CommentController } from '@controllers/comment.controller';
import { Auth } from '@middlewares/auth.middleware';
import { Validate } from '@middlewares/validate';
import Joi from 'joi';

const commentController = new CommentController();
const router = Router();

const objectId = (value: string, helpers: any) => {
  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', { message: 'Must be a valid ObjectId' });
  }
  return value;
};

// User must be authenticated
router.post(
  '/',
  Auth.authenticate('user'),
  Validate.middleware(
    Joi.object({
      content: Joi.string().trim().min(1).max(1000).required().messages({
        'string.base': 'Content must be a string',
        'string.empty': 'Content cannot be empty',
        'string.max': 'Content cannot exceed 1000 characters',
        'any.required': 'Content is required',
      }),
      parentId: Joi.string().custom(objectId).optional().allow(null),
      taskId: Joi.string().custom(objectId).required().messages({
        'any.invalid': 'taskId must be a valid ObjectId',
        'any.required': 'taskId is required',
      }),
    })
  ),
  (req, res, next) => commentController.addComment(req, res, next)
);
router.get('/task/:taskId', Auth.authenticate('user'), (req, res, next) => commentController.getCommentsByTask(req, res, next));
router.patch(
  '/:commentId',
  Auth.authenticate('user'),
  Validate.middleware(
    Joi.object({
      content: Joi.string().trim().min(1).max(1000).required().messages({
        'string.base': 'Content must be a string',
        'string.empty': 'Content cannot be empty',
        'string.max': 'Content cannot exceed 1000 characters',
        'any.required': 'Content is required',
      })
    })
  ),
  (req, res, next) => commentController.updateComment(req, res, next)
);
router.delete('/:commentId', Auth.authenticate('user'), (req, res, next) => commentController.deleteComment(req, res, next));
router.get('/user/:userId', Auth.authenticate('user'), (req, res, next) => commentController.getCommentsByUser(req, res, next));
router.get('/task/:taskId/user/:userId', Auth.authenticate('user'), (req, res, next) => commentController.getCommentsByTaskAndUser(req, res, next));
router.get('/', Auth.authenticate('user'), (req, res, next) => commentController.getAllComments(req, res, next));

export default router;
