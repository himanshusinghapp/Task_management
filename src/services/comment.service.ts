import { logMessage } from '@utils/logger';
import { LOGGER_MESSAGES } from '@common/constants/logger.constant';
import { Exceptions } from '@common/exception/customException';
import { CommentQuery } from '@utils/query';
import { logActivity } from '@utils/audit.util';

export class CommentService {
  async addComment(data: any, userId: string) {
    const comment = await CommentQuery.create({ ...data, createdBy: userId });
    await logActivity(userId, 'ADD_COMMENT', comment._id.toString(), 'Comment', `Comment added on task ${data.taskId}`);
    logMessage('info', LOGGER_MESSAGES.COMMENT_CREATED, { userId, commentId: comment._id });
    return { id: comment._id, content: comment.content, taskId: comment.taskId, parentId: comment.parentId, createdBy: comment.createdBy };
  }

  async getCommentsByTask(taskId: string) {
    return await CommentQuery.findByTask(taskId);
  }

  async getCommentById(commentId: string) {
    const comment = await CommentQuery.findById(commentId);
    if (!comment) throw Exceptions.NotFound('Comment not found');
    return comment;
  }

  async updateComment(commentId: string, userId: string, data: any) {
    const comment = await CommentQuery.findById(commentId);
    if (!comment) throw Exceptions.NotFound('Comment not found');
    // comment.createdBy may be populated or just an ObjectId
    const createdById = comment.createdBy._id ? String(comment.createdBy._id) : String(comment.createdBy);
    if (createdById !== userId) {
      throw Exceptions.Forbidden('You are not authorized to update this comment');
    }
    comment.content = data.content;
    await comment.save();
    return { id: comment._id, content: comment.content, taskId: comment.taskId, parentId: comment.parentId, createdBy: comment.createdBy };
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await CommentQuery.findById(commentId);
    if (!comment) throw Exceptions.NotFound('Comment not found');
    const createdById = comment.createdBy._id ? String(comment.createdBy._id) : String(comment.createdBy);
    if (createdById !== userId) {
      throw Exceptions.Forbidden('You are not authorized to delete this comment');
    }
    await comment.deleteOne();
    return { id: commentId };
  }

  async getAllComments(role: string, userId: string) {
    return role === 'admin'
      ? await CommentQuery.findAll()
      : await CommentQuery.findByUser(userId);
  }

  async getCommentsByUser(userId: string) {
    return await CommentQuery.findByUser(userId);
  }

  async getCommentsByTaskAndUser(taskId: string, userId: string) {
    return await CommentQuery.findByTaskAndUser(taskId, userId);
  }
}
