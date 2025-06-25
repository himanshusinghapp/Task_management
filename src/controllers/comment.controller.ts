import { Request, Response } from 'express';
import { CommentService } from '@services/comment.service';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';
import { logMessage } from '@utils/logger';
import { AuthenticatedRequest } from '@middlewares/auth.middleware';
import { commentDto, updateCommentDto, commentIdDto, taskIdDto } from '@dto/comment.dto';
import { ResponseHelper } from '@common/helpers/response.helper';
import { USER_MESSAGES } from '@/common/constants/userMessage';

const commentService = new CommentService();

export class CommentController {
  async addComment(req: AuthenticatedRequest, res: Response) {
    try {
      const { error } = commentDto.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.details.map(e => e.message).join(', ')));
      }
      const user = req.user;
      const result = await commentService.addComment(req.body, user._id);
      return res.status(HTTP_STATUS.CREATED).json(ResponseHelper.created(USER_MESSAGES.COMMENT_ADDED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.ADD_COMMENT_FAILED, { error: err.message });
      return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(err.status || HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async getCommentsByTask(req: Request, res: Response) {
    try {
      const { error } = taskIdDto.validate({ taskId: req.params.taskId });
      if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.message));
      const result = await commentService.getCommentsByTask(req.params.taskId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_FETCHED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.FETCH_COMMENTS_FAILED, { error: err.message });
      return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(err.status || HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async updateComment(req: AuthenticatedRequest, res: Response) {
    try {
      const { error: paramError } = commentIdDto.validate({ commentId: req.params.commentId });
      if (paramError) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, paramError.message));
      const { error } = updateCommentDto.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.details.map(e => e.message).join(', ')));
      }
      const user = req.user;
      const result = await commentService.updateComment(req.params.commentId, user._id.toString(), req.body);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_UPDATED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.UPDATE_COMMENT_FAILED, { error: err.message });
      return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(err.status || HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async deleteComment(req: AuthenticatedRequest, res: Response) {
    try {
      const { error: paramError } = commentIdDto.validate({ commentId: req.params.commentId });
      if (paramError) return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, paramError.message));
      const user = req.user;
      const result = await commentService.deleteComment(req.params.commentId, user._id.toString());
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_DELETED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.DELETE_COMMENT_FAILED, { error: err.message });
      return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(err.status || HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async getAllComments(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      const result = await commentService.getAllComments(user.role, user._id);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_FETCHED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.FETCH_COMMENTS_FAILED, { error: err.message });
      return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(err.status || HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async getCommentsByUser(req: Request, res: Response) {
    try {
      const result = await commentService.getCommentsByUser(req.params.userId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_FETCHED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.FETCH_COMMENTS_FAILED, { error: err.message });
      return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(err.status || HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }

  async getCommentsByTaskAndUser(req: Request, res: Response) {
    try {
      const { taskId, userId } = req.params;
      const result = await commentService.getCommentsByTaskAndUser(taskId, userId);
      return res.status(HTTP_STATUS.OK).json(ResponseHelper.success(USER_MESSAGES.COMMENT_FETCHED, result));
    } catch (err: any) {
      logMessage('error', LOGGER_MESSAGES.FETCH_COMMENTS_FAILED, { error: err.message });
      return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json(ResponseHelper.error(err.status || HTTP_STATUS.BAD_REQUEST, err.message));
    }
  }
}
