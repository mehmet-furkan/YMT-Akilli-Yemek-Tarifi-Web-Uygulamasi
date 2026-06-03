import { Link } from 'react-router-dom';
import type { Recipe } from '../../types/recipe';
import { useFavorites } from '../../hooks/useFavorites';
import { useAuth } from '../../hooks/useAuth';

interface RecipeCardProps {
  recipe: Recipe;
}

const DIFFICULTY_CONFIG = {
  Kolay: { label: 'Kolay', color: 'bg-emerald-100 text-emerald-700' },
  Orta: { label: 'Orta', color: 'bg-amber-100 text-amber-700' },
  Zor: { label: 'Zor', color: 'bg-rose-100 text-rose-700' },
};

const CATEGORY_EMOJI: Record<string, string> = {
  Kahvaltı: '🍳',
  Çorba: '🍜',
  'Ana Yemek': '🍽️',
  Salata: '🥗',
  Tatlı: '🍮',
  İçecek: '🥤',
  Atıştırmalık: '🥨',
};

// ── FavoriteButton ──────────────────────────────────────────────────────────

interface FavoriteButtonProps {
  recipeId: string;
}

function FavoriteButton({ recipeId }: FavoriteButtonProps) {
  const { isFavorited, toggleFavorite, isMutating } = useFavorites();
  const favorited = isFavorited(recipeId);

  const handleClick = async (e: React.MouseEvent) => {
    // Link'in tıklama eventini engelle — sadece favori toggle'ı çalışsın
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(recipeId);
  };

  return (
    <button
      id={`favorite-btn-${recipeId}`}
      onClick={handleClick}
      disabled={isMutating}
      aria-label={favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      aria-pressed={favorited}
      className={`
        absolute top-2 right-2
        w-8 h-8 rounded-full
        flex items-center justify-center
        backdrop-blur-sm shadow-sm
        transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        ${favorited
          ? 'bg-rose-500 text-white scale-110'
          : 'bg-white/90 text-stone-400 hover:text-rose-500 hover:bg-white hover:scale-110'
        }
      `}
    >
      {favorited ? (
        /* Dolu kalp */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-2.184C4.045 12.223 2 9.914 2 7a5 5 0 018-4 5 5 0 018 4c0 2.914-2.045 5.223-3.885 7.036a22.045 22.045 0 01-2.582 2.184 20.759 20.759 0 01-1.162.682l-.019.01-.005.003h-.002a.739.739 0 01-.69 0h-.002z" />
        </svg>
      ) : (
        /* Boş kalp */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      )}
    </button>
  );
}

// ── RecipeCard ──────────────────────────────────────────────────────────────

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { isAuthenticated } = useAuth();
  const difficulty = DIFFICULTY_CONFIG[recipe.difficulty] ?? DIFFICULTY_CONFIG['Orta'];
  const totalTime = (recipe.prepTime ?? 0) + recipe.cookTime;

  return (
    <Link
      to={`/tarifler/${recipe._id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-amber-100"
      aria-label={`${recipe.title} tarifini gör`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-amber-50 overflow-hidden">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
            <span className="text-5xl select-none" aria-hidden="true">
              {CATEGORY_EMOJI[recipe.category] ?? '🍴'}
            </span>
          </div>
        )}

        {/* Category badge */}
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full border border-amber-100">
          {recipe.category}
        </span>

        {/* Favorite button — sadece giriş yapılmışsa göster */}
        {isAuthenticated && <FavoriteButton recipeId={recipe._id} />}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-stone-800 text-base leading-snug line-clamp-2 mb-1 group-hover:text-amber-700 transition-colors">
          {recipe.title}
        </h3>

        {recipe.description && (
          <p className="text-stone-500 text-sm line-clamp-2 mb-3 leading-relaxed">
            {recipe.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-stone-100">
          <div className="flex items-center gap-3 text-stone-500 text-xs">
            {/* Cook time */}
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 text-amber-500"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5z"
                  clipRule="evenodd"
                />
              </svg>
              {totalTime} dk
            </span>

            {/* Servings */}
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 text-amber-500"
                aria-hidden="true"
              >
                <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655zM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654zM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 17a6.974 6.974 0 0 1-4.696-1.81z" />
              </svg>
              {recipe.servings} kişi
            </span>
          </div>

          {/* Difficulty badge */}
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficulty.color}`}
          >
            {difficulty.label}
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Skeleton placeholder for loading state — same proportions as RecipeCard */
export function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-100 animate-pulse">
      <div className="aspect-[4/3] bg-amber-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        <div className="h-3 bg-stone-100 rounded w-full" />
        <div className="h-3 bg-stone-100 rounded w-5/6" />
        <div className="flex justify-between pt-2 border-t border-stone-100">
          <div className="h-3 bg-stone-100 rounded w-16" />
          <div className="h-3 bg-stone-100 rounded w-12" />
        </div>
      </div>
    </div>
  );
}
