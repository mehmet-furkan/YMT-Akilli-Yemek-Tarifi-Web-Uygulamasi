import { useMutation } from "@tanstack/react-query";
import api from "../lib/axios";
import type { RecommendationResponse } from "../types/recipe";

interface RecommendationPayload {
  ingredients: string[];
  dietaryPreferences?: string[];
}

async function fetchRecommendations(
  payload: RecommendationPayload
): Promise<RecommendationResponse> {
  const response = await api.post<RecommendationResponse>(
    "/recommendations",
    payload
  );
  return response.data;
}

export function useRecommendations() {
  return useMutation({
    mutationFn: fetchRecommendations,
  });
}
