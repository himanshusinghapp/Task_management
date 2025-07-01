import { Router } from 'express';
import { CommentController } from '@controllers';
import { Auth ,Validate} from '@middlewares';
import Joi from 'joi';
import { ROLE, USER_MESSAGES } from '@common/constants';
import { validateObject } from '@/common/helpers';

const commentController = new CommentController();
const router = Router();

const validateObjectInstance = new validateObject();

router.post(
  '/',
  Auth.authenticate(ROLE.USER),
  Validate.body(
    Joi.object({
      content: Joi.string().trim().min(1).max(1000).required().messages({
        'string.base': USER_MESSAGES.COMMENT_NOT_FOUND,
        'string.empty': USER_MESSAGES.COMMENT_NOT_FOUND,
        'string.max': USER_MESSAGES.COMMENT_NOT_FOUND,
        'any.required': USER_MESSAGES.COMMENT_NOT_FOUND,
      }),
      parentId: Joi.string().custom(validateObjectInstance.objectId).optional().allow(null),
      taskId: Joi.string().custom(validateObjectInstance.objectId).required().messages({
        'any.invalid': USER_MESSAGES.INVALID_OBJECT_ID,
        'any.required': USER_MESSAGES.COMMENT_NOT_FOUND,
      }),
    })
  ),
  commentController.createComment
);
router.get('/task/:taskId', Auth.authenticate(ROLE.USER),
Validate.params(
  Joi.object({
    taskId:Joi.string().custom(validateObjectInstance.objectId).required()
  })
),
 commentController.getAllComments);


router.patch(
  '/:commentId',
  Auth.authenticate(ROLE.USER),
  Validate.params(
    Joi.object({
      commentId: Joi.string().custom(validateObjectInstance.objectId).required(),
    })
  ),
  Validate.body(
    Joi.object({
      content: Joi.string().trim().min(1).max(1000).required().messages({
        'string.base': USER_MESSAGES.COMMENT_NOT_FOUND,
        'string.empty': USER_MESSAGES.COMMENT_NOT_FOUND,
        'string.max': USER_MESSAGES.COMMENT_NOT_FOUND,
        'any.required': USER_MESSAGES.COMMENT_NOT_FOUND,
      })
    })
  ),
  commentController.updateComment
);
router.delete('/:commentId', Auth.authenticate(ROLE.USER),Validate.params(
  Joi.object({
    commentId: Joi.string().custom(validateObjectInstance.objectId).required(),
  })
),commentController.deleteComment);
router.get('/', Auth.authenticate(ROLE.USER), 
Validate.params(
  Joi.object({
    commentId: Joi.string().custom(validateObjectInstance.objectId).required(),
  })
),
commentController.getCommentById);

export default router;
