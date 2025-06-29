import { DTO_CONSTANTS } from '@common/constants/dto.constants';

// Comment DTOs (no Joi)
export interface CommentDto {
  content: string;
  parentId?: string | null;
  taskId: string;
}

// Create Comment DTO
export interface CreateCommentDto {
  content: string;
  taskId: string;
  parentId?: string;
  type?: string;
}

// Update Comment DTO
export interface UpdateCommentDto {
  content?: string;
  type?: string;
}

// Comment ID DTO
export interface CommentIdDto {
  commentId: string;
}

export interface TaskIdDto {
  taskId: string;
}

export interface ParentIdDto {
  parentId?: string | null;
}

// Comment Query DTO
export interface CommentQueryDto {
  taskId?: string;
  createdBy?: string;
  type?: string;
  page?: number;
  limit?: number;
}

// Comment Public DTO (for responses)
export interface CommentPublicDto {
  _id: string;
  content: string;
  taskId: string;
  parentId?: string;
  type: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
  