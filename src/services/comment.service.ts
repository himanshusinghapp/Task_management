import { Comment } from '@models';
import { USER_MESSAGES,LOGGER_MESSAGES } from '@common/constants';
import { Exceptions } from '@common/exception';
import { CreateCommentDto, UpdateCommentDto } from '@dto';
import { ValidateObject } from '@common/helpers';
import { logServiceMethod, logServiceError,AuditUtil ,commentQuery} from '@utils';

const validateObjectInstance = new ValidateObject();

export class CommentService {
  async createComment(data: CreateCommentDto, createdBy: string) {
    try {
      logServiceMethod('CommentService', 'createComment', LOGGER_MESSAGES.CREATE, { createdBy, taskId: data.taskId });
      
      await validateObjectInstance.validateObjectId(data.taskId, 'task ID');
      const comment = await Comment.create({ ...data, createdBy });
      await AuditUtil.logActivity(
        createdBy,
        'CREATE_COMMENT',
        String(comment._id),
        'Comment',
        `Comment created on task`
      );

      logServiceMethod('CommentService', 'createComment', LOGGER_MESSAGES.CREATE, { commentId: comment._id, createdBy, taskId: data.taskId });
      return comment;
    } catch (error) {
      logServiceError('CommentService', 'createComment', error, { createdBy, taskId: data.taskId });
      throw error;
    }
  }

  async getAllComments(taskId: string) {
    try {
      logServiceMethod('CommentService', 'getAllComments', LOGGER_MESSAGES.COMMENT_FETCHED, { taskId});
      await validateObjectInstance.validateObjectId(taskId, 'task ID');
      // No pagination supported, use findByTask
      const comments = await commentQuery.findByTask(taskId);
      logServiceMethod('CommentService', 'getAllComments', LOGGER_MESSAGES.COMMENT_FETCHED, { taskId, count: comments.length });
      return comments;
    } catch (error) {
      logServiceError('CommentService', 'getAllComments', error, { taskId });
      throw error;
    }
  }

  async getCommentById(commentId: string) {
    try {
      logServiceMethod('CommentService', 'getCommentById', LOGGER_MESSAGES.COMMENT_FETCHED, { commentId });
      
      await validateObjectInstance.validateObjectId(commentId, 'comment ID');
      const comment = await this.checkComment(commentId);
      
      logServiceMethod('CommentService', 'getCommentById', LOGGER_MESSAGES.COMMENT_FETCHED, { commentId });
      return comment;
    } catch (error) {
      logServiceError('CommentService', 'getCommentById', error, { commentId });
      throw error;
    }
  }

  async updateComment(commentId: string, userId: string, data: UpdateCommentDto) {
    try {
      logServiceMethod('CommentService', 'updateComment', LOGGER_MESSAGES.UPDATE, { commentId, userId, updateData: Object.keys(data) });
      
      await validateObjectInstance.validateObjectId(commentId, 'comment ID');
      const comment = await this.checkComment(commentId);
      
      if (String(comment.createdBy) !== userId) {
        logServiceMethod('CommentService', 'updateComment', LOGGER_MESSAGES.COMMENT_FETCH_FAILED, { commentId, userId, createdBy: comment.createdBy });
        throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);
      }

      Object.assign(comment, data);
      await comment.updateOne(data, { runValidators: true });

      await AuditUtil.logActivity(
        userId,
        'UPDATE_COMMENT',
        String(comment._id),
        'Comment',
        `Comment updated`
      );

      logServiceMethod('CommentService', 'updateComment', LOGGER_MESSAGES.UPDATE, { commentId, userId, updateData: Object.keys(data) });
      return comment;
    } catch (error) {
      logServiceError('CommentService', 'updateComment', error, { commentId, userId, updateData: Object.keys(data) });
      throw error;
    }
  }

  async deleteComment(commentId: string, userId: string) {
    try {
      logServiceMethod('CommentService', 'deleteComment', LOGGER_MESSAGES.DELETE, { commentId, userId });
      
      await validateObjectInstance.validateObjectId(commentId, 'comment ID');
      const comment = await this.checkComment(commentId);
      
      if (String(comment.createdBy) !== userId) {
        logServiceMethod('CommentService', 'deleteComment', LOGGER_MESSAGES.COMMENT_FETCH_FAILED, { commentId, userId, createdBy: comment.createdBy });
        throw Exceptions.Forbidden(USER_MESSAGES.ACCESS_DENIED);
      }
      
      await comment.deleteOne();
      await AuditUtil.logActivity(
        userId,
        'DELETE_COMMENT',
        commentId,
        'Comment',
        `Comment deleted`
      );
      
      logServiceMethod('CommentService', 'deleteComment', LOGGER_MESSAGES.DELETE, { commentId, userId });
      return { commentId };
    } catch (error) {
      logServiceError('CommentService', 'deleteComment', error, { commentId, userId });
      throw error;
    }
  }

  async checkComment(commentId: string) {
    try {
      const comment = await commentQuery.findById(commentId);
      if (!comment) {
        logServiceMethod('CommentService', 'checkComment', LOGGER_MESSAGES.COMMENT_FETCH_FAILED, { commentId });
        throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);
      }
      return comment;
    } catch (error) {
      logServiceError('CommentService', 'checkComment', error, { commentId });
      throw error;
    }
  }
}
