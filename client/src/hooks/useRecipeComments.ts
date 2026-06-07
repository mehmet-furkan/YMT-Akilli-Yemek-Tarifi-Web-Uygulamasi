import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/axios';
import type {
  Comment,
  CommentsResponse,
  CommentResponse,
  CreateCommentPayload,
} from '../types/comment';

const commentsKey = (recipeId: string) => ['recipe-comments', recipeId] as const;

async function fetchComments(recipeId: string): Promise<Comment[]> {
  const { data } = await apiClient.get<CommentsResponse>(
    `/recipes/${recipeId}/comments`
  );
  return data.data;
}

async function postComment(
  recipeId: string,
  payload: CreateCommentPayload
): Promise<Comment> {
  const { data } = await apiClient.post<CommentResponse>(
    `/recipes/${recipeId}/comments`,
    payload
  );
  return data.data;
}

async function deleteCommentApi(commentId: string): Promise<void> {
  await apiClient.delete(`/comments/${commentId}`);
}

/**
 * Bir tarifin yorumlarını/puanlamalarını yönetir.
 *
 * - GET /recipes/:id/comments  (public)
 * - POST /recipes/:id/comments (private, rating + opsiyonel text)
 * - DELETE /comments/:id       (private, owner check)
 *
 * Yorum yaratıldığında veya silindiğinde tek tarif query'sini de invalide eder
 * çünkü Recipe.averageRating / ratingsCount cache'i backend'de güncelleniyor.
 */
export function useRecipeComments(recipeId: string | undefined) {
  const queryClient = useQueryClient();
  const enabled = Boolean(recipeId);

  const { data: comments = [], isLoading, isError } = useQuery({
    queryKey: enabled ? commentsKey(recipeId!) : ['recipe-comments', 'noop'],
    queryFn: () => fetchComments(recipeId!),
    enabled,
  });

  const invalidate = () => {
    if (!recipeId) return;
    queryClient.invalidateQueries({ queryKey: commentsKey(recipeId) });
    queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateCommentPayload) => postComment(recipeId!, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteCommentApi(commentId),
    onSuccess: invalidate,
  });

  return {
    comments,
    isLoading,
    isError,
    createComment: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error as Error | null,
    deleteComment: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
