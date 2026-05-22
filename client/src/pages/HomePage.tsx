import { useQuery } from '@tanstack/react-query';
import { RecipeCard, RecipeCardSkeleton } from '../components/feature/RecipeCard';
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

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 px-4 py-12 sm:py-16 text-center">
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
