import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import type { ApiResponse, Recipe } from '../types/recipe';

async function fetchRecipe(id: string): Promise<Recipe> {
  const { data } = await api.get<ApiResponse<Recipe>>(`/recipes/${id}`);
  return data.data;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Kolay: 'bg-emerald-100 text-emerald-700',
  Orta: 'bg-amber-100 text-amber-700',
  Zor: 'bg-rose-100 text-rose-700',
};

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: recipe, isLoading, isError, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipe(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <RecipeDetailSkeleton />;
  }

  if (isError || !recipe) {
    return (
      <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 text-center">
        <span className="text-5xl mb-4 block" aria-hidden="true">😕</span>
        <h1 className="text-xl font-semibold text-stone-800 mb-2">Tarif bulunamadı</h1>
        <p className="text-stone-500 text-sm mb-6">
          {error instanceof Error ? error.message : 'Bu tarif mevcut değil ya da kaldırılmış.'}
        </p>
        <Link
          to="/"
          className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </main>
    );
  }

  const totalTime = (recipe.prepTime ?? 0) + recipe.cookTime;

  return (
    <main className="min-h-screen bg-stone-50 pb-16">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10z" clipRule="evenodd" />
          </svg>
          Tüm tarifler
        </Link>

        {/* Card with image + content */}
        <article className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
          {/* Image: confined to card width, aspect-[16/9], capped at 20rem tall */}
          <div className="relative w-full aspect-[16/9] max-h-80 bg-amber-100 overflow-hidden">
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200">
                <span className="text-7xl" aria-hidden="true">🍴</span>
              </div>
            )}
          </div>

          <div className="p-5 sm:p-8">
            {/* Category + Difficulty */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Link
                to={`/?category=${encodeURIComponent(recipe.category)}`}
                className="text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 px-2.5 py-1 rounded-full transition-colors"
                aria-label={`${recipe.category} kategorisindeki tarifleri göster`}
              >
                {recipe.category}
              </Link>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  DIFFICULTY_COLOR[recipe.difficulty] ?? 'bg-stone-100 text-stone-600'
                }`}
              >
                {recipe.difficulty}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 leading-tight mb-2">
              {recipe.title}
            </h1>

            {/* Description */}
            {recipe.description && (
              <p className="text-stone-500 text-sm leading-relaxed mb-5">
                {recipe.description}
              </p>
            )}

            {/* Stats row */}
            <div className="flex flex-wrap gap-5 py-4 border-y border-stone-100 mb-6 text-sm">
              <Stat icon="⏱️" label="Toplam Süre" value={`${totalTime} dk`} />
              {(recipe.prepTime ?? 0) > 0 && (
                <Stat icon="🔪" label="Hazırlık" value={`${recipe.prepTime} dk`} />
              )}
              <Stat icon="🍳" label="Pişirme" value={`${recipe.cookTime} dk`} />
              <Stat icon="👥" label="Kişi" value={`${recipe.servings}`} />
            </div>

            {/* Two-column layout on sm+ */}
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Ingredients */}
              <section>
                <h2 className="text-base font-semibold text-stone-800 mb-3">
                  🧺 Malzemeler
                </h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-stone-700"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" aria-hidden="true" />
                      <span>
                        {ing.amount && (
                          <span className="font-medium">
                            {ing.amount}
                            {ing.unit ? ` ${ing.unit}` : ''}{' '}
                          </span>
                        )}
                        {ing.name}
                        {ing.optional && (
                          <span className="text-stone-400 text-xs ml-1">(isteğe bağlı)</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Instructions */}
              <section>
                <h2 className="text-base font-semibold text-stone-800 mb-3">
                  📋 Hazırlanışı
                </h2>
                <ol className="space-y-4">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-stone-700">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg" aria-hidden="true">{icon}</span>
      <span className="font-semibold text-stone-800">{value}</span>
      <span className="text-xs text-stone-400">{label}</span>
    </div>
  );
}

function RecipeDetailSkeleton() {
  return (
    <main className="min-h-screen bg-stone-50 pb-16 animate-pulse">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <div className="h-4 bg-stone-200 rounded w-24 mb-4" />
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-100">
          <div className="w-full aspect-[16/9] max-h-80 bg-amber-100" />
          <div className="p-6 sm:p-8 space-y-4">
            <div className="h-3 bg-stone-200 rounded w-24" />
            <div className="h-6 bg-stone-200 rounded w-3/4" />
            <div className="h-3 bg-stone-100 rounded w-full" />
            <div className="h-3 bg-stone-100 rounded w-5/6" />
            <div className="h-px bg-stone-100 my-4" />
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-3 bg-stone-100 rounded" />
                ))}
              </div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-3 bg-stone-100 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
