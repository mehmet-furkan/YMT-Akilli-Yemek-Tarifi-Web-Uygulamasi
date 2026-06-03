// Night Code Kitchen — Recipe & API Types

export interface RecipeIngredient {
  name: string;
  amount: string | number;
  unit?: string;
  optional?: boolean;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  cookTime: number;
  prepTime: number;
  servings: number;
  category:
    | 'Kahvaltı'
    | 'Çorba'
    | 'Ana Yemek'
    | 'Salata'
    | 'Tatlı'
    | 'İçecek'
    | 'Atıştırmalık';
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  tags: string[];
  imageUrl: string;
  createdBy: string | { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface RecipeListResponse {
  success: boolean;
  count: number;
  data: Recipe[];
}





// ─── Favori için temel Recipe tipi ───────────────────────────────────────────────────────

export interface RecipeIngredient {
  name: string;
  amount: string;
  unit?: string;
  optional?: boolean;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  cookTime: number;
  prepTime?: number;
  servings?: number;
  category: string;
  difficulty: "Kolay" | "Orta" | "Zor";
  tags?: string[];
  imageUrl?: string;
  createdBy: string | { _id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}

// ─── API response wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Favorites ────────────────────────────────────────────────────────────────

export interface Favorite {
  _id: string;
  userId: string;
  recipeId: Recipe;
  createdAt: string;
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export interface RecommendationResult {
  recipe: Recipe;
  /** 0-100 arası eşleşme skoru */
  score: number;
  /** Tarifde olup kullanıcının girmediği malzemeler */
  missingIngredients: string[];
}

export interface RecommendationResponse {
  success: boolean;
  data: RecommendationResult[];
}
