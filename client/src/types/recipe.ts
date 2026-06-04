// Night Code Kitchen — Recipe & API Types

// ─── Malzeme ────────────────────────────────────────────────────────────────

export interface RecipeIngredient {
  name: string;
  amount: string | number;  // Emre: number da gelebilir
  unit?: string;
  optional?: boolean;
}

// ─── Besin değerleri (C.1 — Zehra) ────────────────────────────────────────
// Tüm değerler 1 porsiyon için geçerlidir.
// Furkan Y.'nin B.4 (porsiyon çarpanı) göreviyle koordineli:
//   gösterilen değer = nutrition.calories * multiplier

export interface RecipeNutrition {
  calories?: number; // kcal
  protein?:  number; // gram
  carbs?:    number; // gram
  fat?:      number; // gram
}

// ─── Ana tarif ───────────────────────────────────────────────────────────────

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  cookTime: number;
  prepTime?: number;          // opsiyonel: seed data'da olmayabilir
  servings?: number;          // opsiyonel
  category:
    | 'Kahvaltı'
    | 'Çorba'
    | 'Ana Yemek'
    | 'Salata'
    | 'Tatlı'
    | 'İçecek'
    | 'Atıştırmalık';
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  tags?: string[];            // opsiyonel
  nutrition?: RecipeNutrition; // C.1: besin değerleri — enrichNutrition.js ile doldurulur
  imageUrl?: string;          // opsiyonel
  createdBy: string | { _id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}

// ─── API response wrapper ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface RecipeListResponse {  // Emre'nin eklediği, silinmesin
  success: boolean;
  count: number;
  data: Recipe[];
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export interface RecommendationResult {
  recipe: Recipe;
  score: number;               // 0-100
  missingIngredients: string[];
}

export interface RecommendationResponse {
  success: boolean;
  data: RecommendationResult[];
}
