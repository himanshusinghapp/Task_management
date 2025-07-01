import { Response, NextFunction } from 'express';
import { CommentService } from '@services';
import { HTTP_STATUS ,USER_MESSAGES,LOGGER_MESSAGES} from '@common/constants';
import { ResponseHelper } from '@common/helpers';
import { AuthenticatedRequest } from '@middlewares';
import { logControllerMethod, logControllerError } from '@utils';

const commentService = new CommentService();

export class CommentController {
  async createComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      logControllerMethod('CommentController', 'createComment', LOGGER_MESSAGES.CREATE, { userId: user._id, taskId: req.body.taskId});
      
      const result = await commentService.createComment(req.body, user._id);
      
      logControllerMethod('CommentController', 'createComment', LOGGER_MESSAGES.CREATE, { userId: user._id, commentId: result._id, taskId: req.body.taskId });
      return res.status(HTTP_STATUS.CREATED).json(ResponseHelper.success(USER_MESSAGES.COMMENT_ADDED, result));
    } catch (err: any) {
      logControllerError('CommentController', 'createComment', err, { userId: req.user?._id, taskId: req.body?.taskId });
      return next(err);
    }
  }

  async getAllComments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      logControllerMethod('CommentController', 'getAllComments', LOGGER_MESSAGES.COMMENT_FETCHED, { taskId});
      
      const result = await commentService.getAllComments(taskId);
      
      logControllerMethod('CommentController', 'getAllComments', LOGGER_MESSAGES.COMMENT_FETCHED, { taskId, count: result.length });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_FETCHED, result));
    } catch (err: any) {
      logControllerError('CommentController', 'getAllComments', err, { taskId: req.params.taskId });
      return next(err);
    }
  }

  async getCommentById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.params;
      logControllerMethod('CommentController', 'getCommentById', LOGGER_MESSAGES.COMMENT_FETCHED, { commentId });
      
      const result = await commentService.getCommentById(commentId);
      
      logControllerMethod('CommentController', 'getCommentById', LOGGER_MESSAGES.COMMENT_FETCHED, { commentId });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_FETCHED, result));
    } catch (err: any) {
      logControllerError('CommentController', 'getCommentById', err, { commentId: req.params.commentId });
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
      logControllerMethod('CommentController', 'deleteComment', LOGGER_MESSAGES.DELETE, { commentId, userId: user._id});
      
      const result = await commentService.deleteComment(commentId, user._id);
      
      logControllerMethod('CommentController', 'deleteComment', LOGGER_MESSAGES.DELETE, { commentId, userId: user._id });
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_DELETED, result));
    } catch (err: any) {
      logControllerError('CommentController', 'deleteComment', err, { commentId: req.params.commentId, userId: req.user?._id});
      return next(err);
    }
  }
}
