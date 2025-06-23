import mongoose from 'mongoose';
import { logMessage } from '../utils/logger';
import { LOGGER_MESSAGES } from '../common/constants/logger.constant';
import { USER_MESSAGES } from '../common/constants/userMessage';
import { Exceptions } from '../common/customException';
import { CommentQuery } from '../utils/query';
import { logActivity } from '../utils/audit.util';

export class CommentService {
async addComment(data: any, userId: string) {
  try {
    const comment = await CommentQuery.create({ ...data, createdBy: userId });

    await logActivity(
      userId,
      'ADD_COMMENT',
      comment._id.toString(),
      'Comment',
      `Comment added on task ${data.taskId}`
    );

    logMessage('info', LOGGER_MESSAGES.COMMENT_CREATED, { userId, commentId: comment._id });
    return comment;
  } catch (err: any) {
    logMessage('error', LOGGER_MESSAGES.COMMENT_CREATION_FAILED, { error: err.message });
    throw Exceptions.InternalServerError(USER_MESSAGES.CREATE_FAILED);
  }
}

  async getCommentsByTask(taskId: string) {
    try {
      return await CommentQuery.findByTask(taskId);
    } catch (err: any) {
      throw Exceptions.InternalServerError(USER_MESSAGES.FETCH_FAILED);
    }
  }

  async getCommentById(commentId: string) {
    try {
      const comment = await CommentQuery.findById(commentId);
      if (!comment) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);
      return comment;
    } catch (err: any) {
      throw Exceptions.InternalServerError(USER_MESSAGES.FETCH_FAILED);
    }
  }

  async updateComment(commentId: string, userId: string, data: any) {
    try {
      const comment = await CommentQuery.findById(commentId);
      if (!comment) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);
      const createdById = typeof comment.createdBy === 'object' && comment.createdBy !== null
        ? String(comment.createdBy._id)
        : String(comment.createdBy);
      if (createdById !== userId) {
        throw Exceptions.Forbidden(USER_MESSAGES.UNAUTHORIZED);
      }
      Object.assign(comment, data);
      await comment.save();
      return comment;
    } catch (err: any) {
      throw Exceptions.InternalServerError(err.message);
    }
  }

  async deleteComment(commentId: string, userId: string) {
    try {
      const comment = await CommentQuery.findById(commentId);
      if (!comment) throw Exceptions.NotFound(USER_MESSAGES.NOT_FOUND);
      if (String(comment.createdBy._id) !== userId) {
        throw Exceptions.Forbidden(USER_MESSAGES.UNAUTHORIZED);
      }
      await comment.deleteOne();
      return { message: USER_MESSAGES.DELETE_SUCCESS };
    } catch (err: any) {
      throw Exceptions.InternalServerError(err.message);
    }
  }

  async getAllComments(role: string, userId: string) {
    try {
      return role === 'admin'
        ? await CommentQuery.findAll()
        : await CommentQuery.findByUser(userId);
    } catch (err: any) {
      throw Exceptions.InternalServerError(USER_MESSAGES.FETCH_FAILED);
    }
  }

  async getCommentsByUser(userId: string) {
    try {
      return await CommentQuery.findByUser(userId);
    } catch (err: any) {
      throw Exceptions.InternalServerError(USER_MESSAGES.FETCH_FAILED);
    }
  }

  async getCommentsByTaskAndUser(taskId: string, userId: string) {
    try {
      return await CommentQuery.findByTaskAndUser(taskId, userId);
    } catch (err: any) {
      throw Exceptions.InternalServerError(USER_MESSAGES.FETCH_FAILED);
    }
  }
}
