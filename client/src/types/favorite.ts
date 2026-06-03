// Night Code Kitchen — Favorite Types

import type { Recipe } from './recipe';

export interface Favorite {
  _id: string;
  userId: string;
  recipeId: string;
  createdAt: string;
  updatedAt: string;
}

/** GET /api/favorites dönen tarif nesneleri (populate edilmiş) */
export type FavoriteRecipe = Recipe;

export interface FavoritesResponse {
  success: boolean;
  data: FavoriteRecipe[];
}
