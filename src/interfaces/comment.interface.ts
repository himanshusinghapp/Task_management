import { Document } from 'mongoose';
import { DTO_CONSTANTS } from '@common/constants/dto.constants';

export interface IComment extends Document {
  _id: string;
  content: string;
  taskId: string;
  parentId?: string;
  type: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  isReply(): boolean;
  isEdited(): boolean;
  addLike(userId: string): void;
  removeLike(userId: string): void;
  addDislike(userId: string): void;
  removeDislike(userId: string): void;
  editContent(newContent: string): void;
  getReplies(): Promise<IComment[]>;
}

export interface ICommentService {
  createComment(commentData: any, createdBy: string): Promise<IComment>;
  findCommentById(id: string): Promise<IComment | null>;
  updateComment(id: string, updateData: any, userId: string): Promise<IComment | null>;
  deleteComment(id: string, userId: string): Promise<boolean>;
  getAllComments(taskId: string, query: any): Promise<IComment[]>;
  getCommentsByTask(taskId: string): Promise<IComment[]>;
  getCommentsByUser(userId: string): Promise<IComment[]>;
  getCommentsByType(type: string, taskId?: string): Promise<IComment[]>;
  getCommentReplies(commentId: string): Promise<IComment[]>;
  likeComment(commentId: string, userId: string): Promise<IComment>;
  unlikeComment(commentId: string, userId: string): Promise<IComment>;
  dislikeComment(commentId: string, userId: string): Promise<IComment>;
  undislikeComment(commentId: string, userId: string): Promise<IComment>;
  getCommentStats(commentId: string): Promise<{ likes: number; dislikes: number; replies: number }>;
}

export interface ICommentController {
  createComment(req: any, res: any, next: any): Promise<void>;
  getCommentById(req: any, res: any, next: any): Promise<void>;
  getAllComments(req: any, res: any, next: any): Promise<void>;
  updateComment(req: any, res: any, next: any): Promise<void>;
  deleteComment(req: any, res: any, next: any): Promise<void>;
  getCommentReplies(req: any, res: any, next: any): Promise<void>;
  likeComment(req: any, res: any, next: any): Promise<void>;
  unlikeComment(req: any, res: any, next: any): Promise<void>;
  dislikeComment(req: any, res: any, next: any): Promise<void>;
  undislikeComment(req: any, res: any, next: any): Promise<void>;
  getCommentStats(req: any, res: any, next: any): Promise<void>;
} 