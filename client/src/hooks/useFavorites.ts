import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/axios';
import type { FavoritesResponse, FavoriteRecipe } from '../types/favorite';
import type { ApiResponse } from '../types/recipe';

const FAVORITES_QUERY_KEY = ['favorites'] as const;

// ── API helpers ──────────────────────────────────────────────────────────────

async function fetchFavorites(): Promise<FavoriteRecipe[]> {
  const { data } = await apiClient.get<FavoritesResponse>('/favorites');
  return data.data;
}

async function addFavoriteApi(recipeId: string): Promise<void> {
  await apiClient.post<ApiResponse<unknown>>(`/favorites/${recipeId}`);
}

async function removeFavoriteApi(recipeId: string): Promise<void> {
  await apiClient.delete(`/favorites/${recipeId}`);
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Giriş yapmış kullanıcının favori tariflerini yönetir.
 *
 * Kullanım:
 *   const { favorites, isFavorited, toggleFavorite, isLoading } = useFavorites();
 */
export function useFavorites() {
  const queryClient = useQueryClient();

  const {
    data: favorites = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: fetchFavorites,
    staleTime: 1000 * 60 * 2, // 2 dakika önbellekte taze kalır
  });

  // Bir tarifin favoride olup olmadığını kontrol eder
  const isFavorited = (recipeId: string): boolean =>
    favorites.some((recipe) => recipe._id === recipeId);

  // ── Ekle mutation ────────────────────────────────────────────────────────

  const addMutation = useMutation({
    mutationFn: addFavoriteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  // ── Çıkar mutation ───────────────────────────────────────────────────────

  const removeMutation = useMutation({
    mutationFn: removeFavoriteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  // ── Toggle: ekle veya çıkar ──────────────────────────────────────────────

  const toggleFavorite = async (recipeId: string): Promise<void> => {
    if (isFavorited(recipeId)) {
      await removeMutation.mutateAsync(recipeId);
    } else {
      await addMutation.mutateAsync(recipeId);
    }
  };

  const isMutating = addMutation.isPending || removeMutation.isPending;

  return {
    favorites,
    isLoading,
    isError,
    isFavorited,
    toggleFavorite,
    isMutating,
  };
}
