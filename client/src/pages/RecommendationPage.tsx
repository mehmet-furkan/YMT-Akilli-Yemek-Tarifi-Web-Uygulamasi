import { useState } from "react";
import { IngredientChipInput } from "../components/feature/IngredientChipInput";
import { useRecommendations } from "../hooks/useRecommendations";
import type { RecommendationResult } from "../types/recipe";

// ─── Skeleton kart ─────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-stone-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        <div className="h-3 bg-stone-100 rounded w-1/2" />
        <div className="h-3 bg-stone-100 rounded w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-6 w-20 bg-amber-100 rounded-full" />
          <div className="h-3 w-24 bg-stone-100 rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Sonuç kartı ───────────────────────────────────────────────────────────

function ResultCard({ result }: { result: RecommendationResult }) {
  const { recipe, score, missingIngredients } = result;

  const scoreColor =
    score >= 80
      ? "bg-emerald-100 text-emerald-700"
      : score >= 50
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-600";

  return (
    <article className="rounded-2xl bg-white border border-stone-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {recipe.imageUrl ? (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-44 object-cover"
        />
      ) : (
        <div className="h-44 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
          <span className="text-5xl">🍳</span>
        </div>
      )}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-stone-800 text-base leading-snug">
          {recipe.title}
        </h3>
        <p className="text-stone-500 text-xs line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-1 items-center">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${scoreColor}`}
          >
            %{score} eşleşti
          </span>
          {recipe.cookTime && (
            <span className="text-stone-400 text-xs">⏱ {recipe.cookTime} dk</span>
          )}
          {recipe.difficulty && (
            <span className="text-stone-400 text-xs">{recipe.difficulty}</span>
          )}
        </div>

        {missingIngredients.length > 0 && (
          <p className="text-xs text-stone-400 mt-1">
            <span className="font-medium text-stone-500">Eksik: </span>
            {missingIngredients.join(", ")}
          </p>
        )}
      </div>
    </article>
  );
}

// ─── Sayfa ─────────────────────────────────────────────────────────────────

export default function RecommendationPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const { mutate, data, isPending, isSuccess } = useRecommendations();

  const results = data?.data ?? [];
  const hasSearched = isSuccess;

  function handleSubmit() {
    if (ingredients.length === 0) return;
    mutate({ ingredients });
  }

  return (
    <main className="min-h-screen bg-amber-50/40 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">
            Mutfağında ne var?
          </h1>
          <p className="text-stone-500">
            Elindeki malzemeleri yaz, sana ne yapabileceğini önerelim
          </p>
        </div>

        {/* Giriş alanı */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 space-y-4">
          <label className="block text-sm font-medium text-stone-600">
            Malzemeler
          </label>
          <IngredientChipInput
            ingredients={ingredients}
            onChange={setIngredients}
          />
          <p className="text-xs text-stone-400">
            Her malzemeyi girdikten sonra <kbd className="px-1 py-0.5 bg-stone-100 rounded text-stone-500">Enter</kbd>'a bas
          </p>
          <button
            onClick={handleSubmit}
            disabled={ingredients.length === 0 || isPending}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:cursor-not-allowed text-white font-semibold transition-colors"
          >
            {isPending ? "Öneriler aranıyor…" : "Öneri Al"}
          </button>
        </div>

        {/* Sonuçlar */}
        <section className="mt-10">
          {isPending && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!isPending && hasSearched && results.length === 0 && (
            <div className="text-center py-16 text-stone-400">
              <div className="text-5xl mb-4">🥲</div>
              <p className="text-base font-medium text-stone-500">
                Maalesef eşleşme bulunamadı
              </p>
              <p className="text-sm mt-1">
                Daha fazla malzeme ekle ve tekrar dene
              </p>
            </div>
          )}

          {!isPending && results.length > 0 && (
            <>
              <h2 className="text-sm font-medium text-stone-500 mb-4">
                {results.length} öneri bulundu
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((result) => (
                  <ResultCard key={result.recipe._id} result={result} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
