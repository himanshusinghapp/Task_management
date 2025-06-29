import { Request, Response, NextFunction } from 'express';
import { CommentService } from '@services/comment.service';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import { ResponseHelper } from '@common/helpers/response.helper';
import { USER_MESSAGES } from '@common/constants/userMessage';
import { AuthenticatedRequest } from '@middlewares/auth.middleware';
import { logControllerMethod, logControllerError } from '@utils/logger';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';

const commentService = new CommentService();

export class CommentController {
  async createComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      logControllerMethod('CommentController', 'createComment', LOGGER_MESSAGES.CREATE, { userId: user._id, taskId: req.body.taskId, ip: req.ip });
      
      const result = await commentService.createComment(req.body, user._id);
      
      logControllerMethod('CommentController', 'createComment', LOGGER_MESSAGES.CREATE, { userId: user._id, commentId: result._id, taskId: req.body.taskId });
      return res.status(HTTP_STATUS.CREATED).json(ResponseHelper.success(USER_MESSAGES.COMMENT_ADDED, result));
    } catch (err: any) {
      logControllerError('CommentController', 'createComment', err, { userId: req.user?._id, taskId: req.body?.taskId, ip: req.ip });
      return next(err);
    }
  }

  async getAllComments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      logControllerMethod('CommentController', 'getAllComments', LOGGER_MESSAGES.COMMENT_FETCHED, { taskId, ip: req.ip });
      
      const result = await commentService.getAllComments(taskId);
      
      logControllerMethod('CommentController', 'getAllComments', LOGGER_MESSAGES.COMMENT_FETCHED, { taskId, count: result.length });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_FETCHED, result));
    } catch (err: any) {
      logControllerError('CommentController', 'getAllComments', err, { taskId: req.params.taskId, ip: req.ip });
      return next(err);
    }
  }

  async getCommentById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.params;
      logControllerMethod('CommentController', 'getCommentById', LOGGER_MESSAGES.COMMENT_FETCHED, { commentId, ip: req.ip });
      
      const result = await commentService.getCommentById(commentId);
      
      logControllerMethod('CommentController', 'getCommentById', LOGGER_MESSAGES.COMMENT_FETCHED, { commentId });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_FETCHED, result));
    } catch (err: any) {
      logControllerError('CommentController', 'getCommentById', err, { commentId: req.params.commentId, ip: req.ip });
      return next(err);
    }
  }

  async updateComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { commentId } = req.params;
      logControllerMethod('CommentController', 'updateComment', LOGGER_MESSAGES.UPDATE, { commentId, userId: user._id, updateData: Object.keys(req.body), ip: req.ip });
      
      const result = await commentService.updateComment(commentId, user._id, req.body);
      
      logControllerMethod('CommentController', 'updateComment', LOGGER_MESSAGES.UPDATE, { commentId, userId: user._id, updateData: Object.keys(req.body) });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_UPDATED, result));
    } catch (err: any) {
      logControllerError('CommentController', 'updateComment', err, { commentId: req.params.commentId, userId: req.user?._id, updateData: Object.keys(req.body), ip: req.ip });
      return next(err);
    }
  }

  async deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { commentId } = req.params;
      logControllerMethod('CommentController', 'deleteComment', LOGGER_MESSAGES.DELETE, { commentId, userId: user._id, ip: req.ip });
      
      const result = await commentService.deleteComment(commentId, user._id);
      
      logControllerMethod('CommentController', 'deleteComment', LOGGER_MESSAGES.DELETE, { commentId, userId: user._id });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_DELETED, result));
    } catch (err: any) {
      logControllerError('CommentController', 'deleteComment', err, { commentId: req.params.commentId, userId: req.user?._id, ip: req.ip });
      return next(err);
    }
  }
}
