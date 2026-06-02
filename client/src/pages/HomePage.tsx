import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { RecipeCard, RecipeCardSkeleton } from '../components/feature/RecipeCard';
import { useFavorites } from '../hooks/useFavorites';
import api from '../lib/axios';
import type { RecipeListResponse } from '../types/recipe';

async function fetchRecipes(): Promise<RecipeListResponse> {
  const { data } = await api.get<RecipeListResponse>('/recipes');
  return data;
}

const SKELETON_COUNT = 8;

export default function HomePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });

  const { favorites } = useFavorites();
  const favoriteCount = favorites.length;

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 px-4 py-12 sm:py-16 text-center relative">

        {/* Favorilerim butonu — sağ üst köşe */}
        <Link
          id="nav-favorites-btn"
          to="/favoriler"
          className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/80 hover:bg-white backdrop-blur-sm text-stone-700 hover:text-rose-500 text-sm font-medium px-3.5 py-2 rounded-full shadow-sm border border-amber-100 transition-all duration-200 hover:shadow-md hover:border-rose-200"
          aria-label="Favorilerim sayfasına git"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 transition-colors ${favoriteCount > 0 ? 'text-rose-500' : 'text-stone-400'}`}
            aria-hidden="true"
          >
            <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-2.184C4.045 12.223 2 9.914 2 7a5 5 0 018-4 5 5 0 018 4c0 2.914-2.045 5.223-3.885 7.036a22.045 22.045 0 01-2.582 2.184 20.759 20.759 0 01-1.162.682l-.019.01-.005.003h-.002a.739.739 0 01-.69 0h-.002z" />
          </svg>
          <span>Favorilerim</span>
          {favoriteCount > 0 && (
            <span className="bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
              {favoriteCount}
            </span>
          )}
        </Link>

        <p className="text-amber-600 text-sm font-medium tracking-widest uppercase mb-3">
          Night Code Kitchen
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 leading-tight mb-4">
          Bugün ne pişirsek? 🍳
        </h1>
        <p className="text-stone-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
          Elindeki malzemeleri gir, sana en uygun tarifleri bulalım.
        </p>

        {/* Search bar — placeholder, arama özelliği ile genişletilecek */}
        <div className="mt-6 max-w-md mx-auto flex gap-2">
          <input
            type="search"
            placeholder="Tarif veya malzeme ara..."
            className="flex-1 bg-white border border-amber-200 rounded-full px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm"
          />
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm px-5 py-2.5 rounded-full transition-colors shadow-sm">
            Ara
          </button>
        </div>
      </section>

      {/* Recipe grid */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-stone-800">
            {isLoading
              ? 'Tarifler yükleniyor…'
              : isError
              ? 'Tarifler'
              : `Tüm Tarifler ${data?.count ? `(${data.count})` : ''}`}
          </h2>
        </div>

        {/* Error state */}
        {isError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-5 py-4 text-sm">
            <strong>Bir hata oluştu:</strong>{' '}
            {error instanceof Error
              ? error.message
              : 'Tarifler yüklenemedi. Lütfen tekrar deneyin.'}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))
            : data?.data.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
        </div>

        {/* Empty state */}
        {!isLoading && !isError && data?.data.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <span className="text-5xl block mb-4" aria-hidden="true">🥄</span>
            <p className="text-base font-medium text-stone-600">Henüz tarif yok.</p>
            <p className="text-sm mt-1">
              Backend'de <code className="bg-stone-100 px-1 rounded">npm run seed</code> komutunu
              çalıştırarak örnek tarifleri ekleyebilirsin.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
