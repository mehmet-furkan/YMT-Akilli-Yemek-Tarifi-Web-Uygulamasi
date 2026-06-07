// Night Code Kitchen — Comment Types

export interface CommentAuthor {
  _id: string;
  name: string;
}

export interface Comment {
  _id: string;
  recipeId: string;
  userId: CommentAuthor | string;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponse {
  success: boolean;
  data: Comment[];
}

export interface CommentResponse {
  success: boolean;
  data: Comment;
}

export interface CreateCommentPayload {
  rating: number;
  text?: string;
}
