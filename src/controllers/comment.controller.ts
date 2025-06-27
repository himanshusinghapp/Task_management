import { Request, Response, NextFunction } from 'express';
import { CommentService } from '@services/comment.service';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';
import { logMessage } from '@utils/logger';
import { AuthenticatedRequest } from '@middlewares/auth.middleware';
import { ResponseHelper } from '@common/helpers/response.helper';
import { USER_MESSAGES } from '@/common/constants/userMessage';
import { CommentDto, UpdateCommentDto } from '@dto/comment.dto';

const commentService = new CommentService();

export class CommentController {
  async addComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const body: CommentDto = req.body;
      const result = await commentService.addComment(body, user._id);
      return res.status(HTTP_STATUS.CREATED).json(ResponseHelper.created(USER_MESSAGES.COMMENT_ADDED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ADD_COMMENT_FAILED, { error: err.message });
      return next(err);
    }
  }

  async getCommentsByTask(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await commentService.getCommentsByTask(req.params.taskId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_FETCHED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.FETCH_COMMENTS_FAILED, { error: err.message });
      return next(err);
    }
  }

  async updateComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const body: UpdateCommentDto = req.body;
      const result = await commentService.updateComment(req.params.commentId, user._id.toString(), body);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_UPDATED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.UPDATE_COMMENT_FAILED, { error: err.message });
      return next(err);
    }
  }

  async deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const result = await commentService.deleteComment(req.params.commentId, user._id.toString());
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_DELETED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.DELETE_COMMENT_FAILED, { error: err.message });
      return next(err);
    }
  }

  async getAllComments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const result = await commentService.getAllComments(user.role, user._id);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_FETCHED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.FETCH_COMMENTS_FAILED, { error: err.message });
      return next(err);
    }
  }

  async getCommentsByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await commentService.getCommentsByUser(req.params.userId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_FETCHED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.FETCH_COMMENTS_FAILED, { error: err.message });
      return next(err);
    }
  }

  async getCommentsByTaskAndUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId, userId } = req.params;
      const result = await commentService.getCommentsByTaskAndUser(taskId, userId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_FETCHED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.FETCH_COMMENTS_FAILED, { error: err.message });
      return next(err);
    }
  }
}
