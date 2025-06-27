// Comment DTOs (no Joi)
export interface CommentDto {
  content: string;
  parentId?: string | null;
  taskId: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface CommentIdDto {
  commentId: string;
}

export interface TaskIdDto {
  taskId: string;
}

export interface ParentIdDto {
  parentId?: string | null;
}
  