import { useMutation } from "@tanstack/react-query";
import api from "../lib/axios";
import type { RecommendationResponse } from "../types/recipe";

interface RecommendationPayload {
  ingredients: string[];
  dietaryPreferences?: string[];
  category?: string | null;
}

async function fetchRecommendations(
  payload: RecommendationPayload
): Promise<RecommendationResponse> {
  const { ingredients, dietaryPreferences, category } = payload;

  const body: Record<string, unknown> = { ingredients, dietaryPreferences };
  if (category) {
    body.category = category;
  }

  const response = await api.post<RecommendationResponse>(
    "/recommendations",
    body
  );
  return response.data;
}

export function useRecommendations() {
  return useMutation({
    mutationFn: fetchRecommendations,
  });
}

