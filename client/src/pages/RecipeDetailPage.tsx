import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import type { ApiResponse, Recipe, RecipeNutrition } from "../types/recipe";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 20;

const DIFFICULTY_COLOR: Record<string, string> = {
  Kolay: "bg-emerald-100 text-emerald-700",
  Orta: "bg-amber-100 text-amber-700",
  Zor: "bg-rose-100 text-rose-700",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchRecipe(id: string): Promise<Recipe> {
  const { data } = await api.get<ApiResponse<Recipe>>(`/recipes/${id}`);
  if (!data.success) throw new Error(data.message ?? "Tarif alınamadı");
  return data.data;
}

/** Scaled bir miktarı okunabilir stringe çevirir; gereksiz ondalıkları atar. */
function formatAmount(value: number): string {
  if (value === 0) return "0";
  const rounded = Math.round(value * 100) / 100;
  if (rounded % 1 === 0) return String(rounded);
  return rounded.toFixed(2).replace(/\.?0+$/, "");
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Stat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg">{icon}</span>
      <span className="font-semibold text-stone-800">{value}</span>
      <span className="text-xs text-stone-400">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ServingStepper
// ---------------------------------------------------------------------------

function ServingStepper({
  servings,
  originalServings,
  onChange,
}: {
  servings: number;
  originalServings: number;
  onChange: (value: number) => void;
}) {
  const canDecrement = servings > MIN_SERVINGS;
  const canIncrement = servings < MAX_SERVINGS;

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Porsiyon azalt"
          disabled={!canDecrement}
          onClick={() => onChange(servings - 1)}
          className="w-9 h-9 rounded-full border-2 border-amber-500 text-amber-600 font-bold text-xl flex items-center justify-center transition-colors hover:bg-amber-50 active:bg-amber-100 disabled:border-stone-200 disabled:text-stone-300 disabled:cursor-not-allowed select-none"
        >
          −
        </button>

        <span
          aria-live="polite"
          className="font-bold min-w-[70px] text-center text-stone-800 tabular-nums"
        >
          {servings} kişi
        </span>

        <button
          type="button"
          aria-label="Porsiyon artır"
          disabled={!canIncrement}
          onClick={() => onChange(servings + 1)}
          className="w-9 h-9 rounded-full border-2 border-amber-500 text-amber-600 font-bold text-xl flex items-center justify-center transition-colors hover:bg-amber-50 active:bg-amber-100 disabled:border-stone-200 disabled:text-stone-300 disabled:cursor-not-allowed select-none"
        >
          +
        </button>
      </div>

      {servings !== originalServings && (
        <span className="text-xs text-stone-400 pl-0.5">
          Orijinal: {originalServings} kişilik
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// NutritionAccordion
// ---------------------------------------------------------------------------

function NutritionAccordion({
  nutrition,
  multiplier = 1,
}: {
  nutrition: RecipeNutrition;
  multiplier?: number;
}) {
  const [open, setOpen] = useState(false);

  const scaled = (val?: number) =>
    val != null ? Math.round(val * multiplier) : null;

  const rows = [
    { label: "Protein", value: scaled(nutrition.protein), unit: "g", color: "bg-blue-400" },
    { label: "Karbonhidrat", value: scaled(nutrition.carbs), unit: "g", color: "bg-amber-400" },
    { label: "Yağ", value: scaled(nutrition.fat), unit: "g", color: "bg-rose-400" },
  ].filter((r) => r.value != null);

  if (rows.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-stone-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 hover:bg-amber-50 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-stone-700">
          📊 Besin Değerleri
          {nutrition.calories != null && (
            <span className="text-xs text-stone-400 font-normal">
              (≈ {scaled(nutrition.calories)} kcal)
            </span>
          )}
        </span>
        <span className="text-stone-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="p-4 bg-white">
          <ul className="space-y-3">
            {rows.map((row) => (
              <li key={row.label} className="flex items-center gap-3 text-sm">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${row.color}`} />
                <span className="w-28 text-stone-600">{row.label}</span>
                <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${row.color}`}
                    style={{ width: `${Math.min(100, row.value ?? 0)}%` }}
                  />
                </div>
                <span className="font-semibold w-14 text-right text-stone-800">
                  {row.value} {row.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function RecipeDetailSkeleton() {
  return (
    <main className="min-h-screen bg-stone-50 animate-pulse">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <div className="h-4 bg-stone-200 rounded w-24 mb-4" />
        <div className="bg-white rounded-2xl overflow-hidden border border-amber-100">
          <div className="aspect-[16/9] bg-stone-200" />
          <div className="p-6 space-y-4">
            <div className="h-6 bg-stone-200 rounded w-3/4" />
            <div className="h-4 bg-stone-100 rounded w-full" />
            <div className="h-4 bg-stone-100 rounded w-5/6" />
            <div className="grid sm:grid-cols-2 gap-8 mt-4">
              {[0, 1].map((col) => (
                <div key={col} className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-4 bg-stone-100 rounded" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: recipe,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipe(id!),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });

  const [servings, setServings] = useState<number | null>(null);

  // recipe yüklenince stepper'ı recipe.servings ile senkronize et.
  // Sonraki render'larda kullanıcı değişikliğini ezmemek için null guard var.
  useEffect(() => {
    if (recipe && servings === null) {
      setServings(recipe.servings);
    }
  }, [recipe, servings]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) return <RecipeDetailSkeleton />;

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError || !recipe) {
    return (
      <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-center px-4">
        <span className="text-5xl mb-4">😕</span>
        <h1 className="text-xl font-semibold mb-2">Tarif bulunamadı</h1>
        <p className="text-stone-500 mb-6">
          {error instanceof Error
            ? error.message
            : "Bu tarif mevcut değil veya kaldırılmış."}
        </p>
        <Link
          to="/"
          className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-full transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </main>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────
  const currentServings = servings ?? recipe.servings;
  const multiplier = currentServings / recipe.servings;
  const totalTime = (recipe.prepTime ?? 0) + recipe.cookTime;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-stone-50 pb-16">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700 transition-colors mb-4"
        >
          ← Tüm Tarifler
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
          {/* Hero image */}
          <div className="relative w-full aspect-[16/9] bg-amber-100">
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl">
                🍴
              </div>
            )}
          </div>

          <div className="p-5 sm:p-8">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Link
                to={`/?category=${encodeURIComponent(recipe.category)}`}
                className="px-2.5 py-1 rounded-full text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
              >
                {recipe.category}
              </Link>
              <span
                className={`px-2.5 py-1 rounded-full text-xs ${
                  DIFFICULTY_COLOR[recipe.difficulty] ?? "bg-stone-100 text-stone-600"
                }`}
              >
                {recipe.difficulty}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-stone-800 mb-2">
              {recipe.title}
            </h1>

            {recipe.createdBy && (
              <p className="text-sm text-stone-400 mb-3">
                Ekleyen:{" "}
                <span className="text-stone-600 font-medium">
                  {recipe.createdBy.name}
                </span>
              </p>
            )}

            {recipe.description && (
              <p className="text-stone-500 leading-relaxed mb-5">
                {recipe.description}
              </p>
            )}

            {/* ── Stats row (FR-2 stepper burada) ── */}
            <div className="flex flex-wrap items-end gap-5 py-4 border-y border-stone-100 mb-5">
              <Stat icon="⏱️" label="Toplam Süre" value={`${totalTime} dk`} />

              {(recipe.prepTime ?? 0) > 0 && (
                <Stat icon="🔪" label="Hazırlık" value={`${recipe.prepTime} dk`} />
              )}

              <Stat icon="🍳" label="Pişirme" value={`${recipe.cookTime} dk`} />

              <Stat icon="👥" label="Kişi" value={String(currentServings)} />

              {recipe.nutrition?.calories != null && (
                <Stat
                  icon="🔥"
                  label="Kalori"
                  value={`≈ ${Math.round(recipe.nutrition.calories * multiplier)} kcal`}
                />
              )}

              {/* Stepper — sağa yaslanır */}
              <div className="ml-auto">
                <ServingStepper
                  servings={currentServings}
                  originalServings={recipe.servings}
                  onChange={setServings}
                />
              </div>
            </div>

            {/* Nutrition accordion */}
            {recipe.nutrition && (
              <NutritionAccordion
                nutrition={recipe.nutrition}
                multiplier={multiplier}
              />
            )}

            {/* Ingredients + Instructions grid */}
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Malzemeler */}
              <section>
                <h2 className="text-base font-semibold text-stone-800 mb-3">
                  🧺 Malzemeler
                </h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing, idx) => {
                    const scaledAmount = ing.amount * multiplier;
                    return (
                      <li key={ing._id ?? idx} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>
                          <span className="font-medium text-stone-800">
                            {formatAmount(scaledAmount)}
                            {ing.unit ? ` ${ing.unit}` : ""}
                          </span>{" "}
                          <span className="text-stone-600">{ing.name}</span>
                          {ing.optional && (
                            <span className="text-xs text-stone-400 ml-1">
                              (isteğe bağlı)
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* Hazırlanışı */}
              <section>
                <h2 className="text-base font-semibold text-stone-800 mb-3">
                  📋 Hazırlanışı
                </h2>
                <ol className="space-y-4">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-stone-700 leading-relaxed">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            {/* Tags */}
            {recipe.tags?.length > 0 && (
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
