import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

interface HealthResponse {
  status: string;
  message: string;
}

function HomePage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<HealthResponse>({
    queryKey: ["health"],
    queryFn: async () => {
      const res = await apiClient.get("/health");
      return res.data;
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4">
      {/* ── Logo / Branding ── */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <span className="text-5xl">🍳</span>
        <h1 className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          Night Code Kitchen
        </h1>
        <p className="text-sm text-slate-400">Akıllı Yemek Tarifi Uygulaması</p>
      </div>

      {/* ── Health Card ── */}
      <div className="w-full max-w-md rounded-2xl border border-surface-lighter bg-surface-light/60 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-brand-500/10 hover:shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-200">
          🔗 API Bağlantı Durumu
        </h2>

        {isLoading && (
          <div className="flex items-center gap-3 text-slate-400">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
            Bağlantı kontrol ediliyor…
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <p className="font-medium">❌ Bağlantı Hatası</p>
            <p className="mt-1 text-xs text-red-400">
              {(error as Error)?.message || "Sunucuya ulaşılamıyor"}
            </p>
          </div>
        )}

        {data && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <p className="font-medium">✅ API Bağlı</p>
            <pre className="mt-2 overflow-auto rounded bg-surface/60 p-3 text-xs text-slate-300">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <p className="mt-10 text-xs text-slate-600">
        Night Code Kitchen &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}

export default HomePage;





import { useQuery } from '@tanstack/react-query';
import { RecipeCard, RecipeCardSkeleton } from '../components/feature/RecipeCard';
import api from '../lib/api';
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
