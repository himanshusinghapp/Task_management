import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { HTTP_STATUS } from '../common/constants/httpStatus';
import { LOGGER_MESSAGES } from '../common/constants/logger.constant';
import { logMessage } from '../utils/logger';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

const commentService = new CommentService();

export class CommentController {
  async addComment(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      const result = await commentService.addComment(req.body, user._id);
      return res.status(HTTP_STATUS.CREATED).json(result);
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ADD_COMMENT_FAILED, { error: err.message });
      return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async getCommentsByTask(req: Request, res: Response) {
    try {
      const result = await commentService.getCommentsByTask(req.params.taskId);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.FETCH_COMMENTS_FAILED, { error: err.message });
      return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async updateComment(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      const result = await commentService.updateComment(req.params.commentId, user._id.toString(), req.body);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.UPDATE_COMMENT_FAILED, { error: err.message });
      return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async deleteComment(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      const result = await commentService.deleteComment(req.params.commentId, user._id.toString());
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.DELETE_COMMENT_FAILED, { error: err.message });
      return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async getAllComments(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      const result = await commentService.getAllComments(user.role, user._id);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.FETCH_COMMENTS_FAILED, { error: err.message });
      return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async getCommentsByUser(req: Request, res: Response) {
    try {
      const result = await commentService.getCommentsByUser(req.params.userId);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.FETCH_COMMENTS_FAILED, { error: err.message });
      return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }

  async getCommentsByTaskAndUser(req: Request, res: Response) {
    try {
      const { taskId, userId } = req.params;
      const result = await commentService.getCommentsByTaskAndUser(taskId, userId);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.FETCH_COMMENTS_FAILED, { error: err.message });
      return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
  }
}
