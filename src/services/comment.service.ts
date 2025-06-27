import { logMessage } from '@utils/logger';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';
import { Exceptions } from '@common/exception/customException';
import { commentQuery } from '@utils/query';
import { logActivity } from '@utils/audit.util';
import { USER_MESSAGES } from '@/common/constants/userMessage';
import { CommentDto, UpdateCommentDto } from '@dto/comment.dto';

export class CommentService {
  async addComment(data: CommentDto, userId: string) {
    const comment = await commentQuery.create({ ...data, createdBy: userId });
    await logActivity(userId, 'ADD_COMMENT', comment._id.toString(), 'Comment', `Comment added on task ${data.taskId}`);
    logMessage('info', LOGGER_MESSAGES.COMMENT_CREATED, { userId, commentId: comment._id });
    return { id: comment._id, content: comment.content, taskId: comment.taskId, parentId: comment.parentId, createdBy: comment.createdBy };
  }

  async getCommentsByTask(taskId: string) {
    return await commentQuery.findByTask(taskId);
  }

  async getCommentById(commentId: string) {
    const comment = await this.checkComment(commentId);
    return comment;
  }

  async updateComment(commentId: string, userId: string, data: UpdateCommentDto) {
    const comment = await this.checkComment(commentId);
    const createdById = comment.createdBy._id ? String(comment.createdBy._id) : String(comment.createdBy);
    if (createdById !== userId) {
      throw Exceptions.Forbidden(USER_MESSAGES.UNAUTHORIZED_UPDATE_COMMENT);
    }
    comment.content = data.content;
    await comment.save();
    return { id: comment._id, content: comment.content, taskId: comment.taskId, parentId: comment.parentId, createdBy: comment.createdBy };
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.checkComment(commentId);
    const createdById = comment.createdBy._id ? String(comment.createdBy._id) : String(comment.createdBy);
    if (createdById !== userId) {
      throw Exceptions.Forbidden(USER_MESSAGES.UNAUTHORIZED_DELETE_COMMENT);
    }
    await comment.deleteOne();
    return { id: commentId };
  }

  async getAllComments(role: string, userId: string) {
    return role === 'admin'
      ? await commentQuery.findAll()
      : await commentQuery.findByUser(userId);
  }

  async getCommentsByUser(userId: string) {
    return await commentQuery.findByUser(userId);
  }

  async getCommentsByTaskAndUser(taskId: string, userId: string) {
    return await commentQuery.findByTaskAndUser(taskId, userId);
  }

  async checkComment(commentId: string) {
    const comment = await commentQuery.findById(commentId);
    if (!comment) throw Exceptions.NotFound(USER_MESSAGES.COMMENT_NOT_FOUND);
    return comment;
  }
}
