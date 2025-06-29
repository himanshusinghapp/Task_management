import { Router } from 'express';
import { CommentController } from '@controllers/comment.controller';
import { Auth } from '@middlewares/auth.middleware';
import { Validate } from '@middlewares/validate';
import Joi from 'joi';
import { USER_MESSAGES } from '@common/constants/userMessage';

const commentController = new CommentController();
const router = Router();

const objectId = (value: string, helpers: any) => {
  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', { message: USER_MESSAGES.INVALID_OBJECT_ID });
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
        'string.base': USER_MESSAGES.COMMENT_NOT_FOUND,
        'string.empty': USER_MESSAGES.COMMENT_NOT_FOUND,
        'string.max': USER_MESSAGES.COMMENT_NOT_FOUND,
        'any.required': USER_MESSAGES.COMMENT_NOT_FOUND,
      }),
      parentId: Joi.string().custom(objectId).optional().allow(null),
      taskId: Joi.string().custom(objectId).required().messages({
        'any.invalid': USER_MESSAGES.INVALID_OBJECT_ID,
        'any.required': USER_MESSAGES.COMMENT_NOT_FOUND,
      }),
    })
  ),
  (req, res, next) => commentController.createComment(req, res, next)
);
router.get('/task/:taskId', Auth.authenticate('user'), (req, res, next) => commentController.getAllComments(req, res, next));
router.patch(
  '/:commentId',
  Auth.authenticate('user'),
  Validate.middleware(
    Joi.object({
      content: Joi.string().trim().min(1).max(1000).required().messages({
        'string.base': USER_MESSAGES.COMMENT_NOT_FOUND,
        'string.empty': USER_MESSAGES.COMMENT_NOT_FOUND,
        'string.max': USER_MESSAGES.COMMENT_NOT_FOUND,
        'any.required': USER_MESSAGES.COMMENT_NOT_FOUND,
      })
    })
  ),
  (req, res, next) => commentController.updateComment(req, res, next)
);
router.delete('/:commentId', Auth.authenticate('user'), (req, res, next) => commentController.deleteComment(req, res, next));
router.get('/', Auth.authenticate('user'), (req, res, next) => commentController.getCommentById(req, res, next));

export default router;
