// src/types/recipe.ts
// Recipe ile ilgili tüm ortak tipler

// ─────────────────────────────────────────────────────────────
// Ingredients
// ─────────────────────────────────────────────────────────────

export interface RecipeIngredient {
  _id?: string;
  name: string;

  /**
   * Porsiyon çarpanı hesaplarında kullanıldığı için
   * number tutulmalıdır.
   */
  amount: number;

  unit?: string;
  optional?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Nutrition
// ─────────────────────────────────────────────────────────────

export interface RecipeNutrition {
  /** kcal / porsiyon */
  calories?: number;

  /** gram / porsiyon */
  protein?: number;

  /** gram / porsiyon */
  carbs?: number;

  /** gram / porsiyon */
  fat?: number;
}

// ─────────────────────────────────────────────────────────────
// Author
// ─────────────────────────────────────────────────────────────

export interface RecipeAuthor {
  _id: string;
  name: string;
}

// ─────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────

export type DifficultyLevel =
  | "Kolay"
  | "Orta"
  | "Zor";

export type MealCategory =
  | "Kahvaltı"
  | "Çorba"
  | "Ana Yemek"
  | "Salata"
  | "Tatlı"
  | "İçecek"
  | "Atıştırmalık";

// ─────────────────────────────────────────────────────────────
// Recipe
// ─────────────────────────────────────────────────────────────

export interface Recipe {
  _id: string;

  title: string;
  description: string;

  ingredients: RecipeIngredient[];
  instructions: string[];

  cookTime: number;

  /**
   * Seed verilerde bulunmayabilir.
   */
  prepTime?: number;

  /**
   * Porsiyon çarpanı hesabı (B.4) için kullanılır.
   * Eski/seed verilerde bulunmayabilir; eksik gelirse
   * RecipeDetailPage 4 kişilik varsayılan uygular.
   */
  servings?: number;

  /**
   * Şimdilik sabit kategoriler.
   * İleride genişletilecekse:
   * MealCategory | string yapılabilir.
   */
  category: MealCategory;

  difficulty: DifficultyLevel;

  /**
   * Bazı eski tariflerde olmayabilir.
   */
  tags?: string[];

  /**
   * Enrich script tarafından doldurulur.
   */
  nutrition?: RecipeNutrition;

  imageUrl?: string;

  /**
   * Populate edilmemiş:
   * "68431d8..."
   *
   * Populate edilmiş:
   * { _id, name }
   */
  createdBy?: string | RecipeAuthor;

  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────────────────────
// API Responses
// ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Tarif listeleri için.
 */
export interface RecipeListResponse {
  success: boolean;
  count: number;
  data: Recipe[];
}

/**
 * Genel sayfalama tipi.
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ─────────────────────────────────────────────────────────────
// Recommendations
// ─────────────────────────────────────────────────────────────

export interface RecommendationResult {
  recipe: Recipe;
  score: number;
  missingIngredients: string[];
}

export interface RecommendationResponse {
  success: boolean;
  data: RecommendationResult[];
}
