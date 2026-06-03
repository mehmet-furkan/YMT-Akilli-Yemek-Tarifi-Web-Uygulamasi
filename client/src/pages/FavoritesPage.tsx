import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { RecipeCard, RecipeCardSkeleton } from '../components/feature/RecipeCard';

export default function FavoritesPage() {
  const { favorites, isLoading, isError } = useFavorites();

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-amber-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            to="/"
            className="text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="Ana sayfaya dön"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-rose-500" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-2.184C4.045 12.223 2 9.914 2 7a5 5 0 018-4 5 5 0 018 4c0 2.914-2.045 5.223-3.885 7.036a22.045 22.045 0 01-2.582 2.184 20.759 20.759 0 01-1.162.682l-.019.01-.005.003h-.002a.739.739 0 01-.69 0h-.002z" />
              </svg>
            </span>
            <h1 className="text-lg font-bold text-stone-800">Favorilerim</h1>
            {!isLoading && favorites.length > 0 && (
              <span className="text-xs bg-rose-100 text-rose-600 font-medium px-2 py-0.5 rounded-full">
                {favorites.length}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4 block" aria-hidden="true">⚠️</span>
            <h2 className="text-lg font-semibold text-stone-800 mb-2">
              Favoriler yüklenemedi
            </h2>
            <p className="text-stone-500 text-sm">
              Lütfen sayfayı yenileyip tekrar deneyin.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-rose-300"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-stone-800 mb-2">
              Henüz favori tarifiniz yok
            </h2>
            <p className="text-stone-500 text-sm mb-6 max-w-xs">
              Tarif kartlarındaki kalp ikonuna tıklayarak beğendiğiniz tarifleri
              buraya kaydedin.
            </p>
            <Link
              id="favorites-explore-link"
              to="/"
              className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              Tarifleri Keşfet
            </Link>
          </div>
        )}

        {/* Favorites grid */}
        {!isLoading && !isError && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
