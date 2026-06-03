import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { RecipeCard, RecipeCardSkeleton } from '../components/feature/RecipeCard';
import { useFavorites } from '../hooks/useFavorites';
import api from '../lib/axios';
import type { RecipeListResponse } from '../types/recipe';

// Backend's `?limit` is hard-capped at 100 in recipes.controller.js. We send
// the max so HomePage can do client-side filtering (search + category) over
// the full corpus without pagination round-trips. Bump this once the corpus
// outgrows 100 recipes and add real pagination.
const RECIPES_PAGE_LIMIT = 100;
const SKELETON_COUNT = 8;

async function fetchRecipes(): Promise<RecipeListResponse> {
  const { data } = await api.get<RecipeListResponse>('/recipes', {
    params: { limit: RECIPES_PAGE_LIMIT },
  });
  return data;
}

// --- BULANIK ARAMA (FUZZY SEARCH) İÇİN MATEMATİKSEL ALGORİTMA ---
function getEditDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  return matrix[b.length][a.length];
}

// Kelimenin metin içinde geçip geçmediğini veya benzer olup olmadığını kontrol eder
function isWordMatch(searchWord: string, text: string): boolean {
  if (text.includes(searchWord)) return true; // Tam veya yarım kayıpsız eşleşme

  const textWords = text.split(/[\s,.-]+/);
  // DİNAMİK HATA PAYI: 5 harf ve altına 1 hata, daha uzununa 2 hata toleransı
  const allowedDistance = searchWord.length <= 5 ? 1 : 2;

  for (const tWord of textWords) {
    if (searchWord.length > 3) {
      // 1. TAM KELİME KONTROLÜ (Örn: doyatek -> domates)
      if (Math.abs(tWord.length - searchWord.length) <= allowedDistance) {
        if (getEditDistance(searchWord, tWord) <= allowedDistance) return true;
      }

      // 2. YARIM KELİME KONTROLÜ (Örn: doyat -> domat)
      if (tWord.length >= searchWord.length) {
        const prefix = tWord.substring(0, searchWord.length);
        if (getEditDistance(searchWord, prefix) <= allowedDistance) return true;
      }
    }
  }
  return false;
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['recipes', RECIPES_PAGE_LIMIT],
    queryFn: fetchRecipes,
  });

  // Favorites: count badge on the top-right nav button
  const { favorites } = useFavorites();
  const favoriteCount = favorites.length;

  const clearCategory = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('category');
    setSearchParams(next, { replace: true });
  };

  // Fuzzy search + category filter: filter the recipe list client-side based
  // on title, description and ingredients with Levenshtein-based tolerance,
  // then apply the URL-driven category filter.

  const filteredRecipes = data?.data.filter((recipe) => {
    // 1. Kategori filtresi (URL'den gelir)
    if (selectedCategory && recipe.category !== selectedCategory) {
      return false;
    }

    // 2. Türkçe karakterli (I->ı, İ->i) küçük harf çevirisi
    const searchWords = searchTerm
      .toLocaleLowerCase('tr-TR')
      .split(' ')
      .filter((word) => word.trim() !== '');
    if (searchWords.length === 0) return true;

    // 3. Aranabilir metni birleştir (başlık + açıklama + malzemeler)
    const rawText = [
      recipe.title,
      recipe.description,
      recipe.ingredients ? JSON.stringify(recipe.ingredients) : '',
    ].join(' ');

    // 4. Tırnakları, parantezleri sil, ardından Türkçe küçült
    const searchableText = rawText
      .toLocaleLowerCase('tr-TR')
      .replace(/[\[\]"'{}]/g, ' ');

    return searchWords.every((word) => isWordMatch(word, searchableText));
  });

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero — `relative` so the Favorites nav button can be absolutely positioned */}
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

        <div className="mt-6 max-w-md mx-auto flex gap-2">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Örn: domates soğan tereyağı..."
            className="flex-1 bg-white border border-amber-200 rounded-full px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm"
          />
          <button
            type="button"
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm px-5 py-2.5 rounded-full transition-colors shadow-sm"
          >
            Ara
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        {/* Active category banner */}
        {selectedCategory && (
          <div className="mb-6 flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
            <p className="text-sm text-stone-700">
              <span className="text-stone-500">Kategori:</span>{' '}
              <span className="font-semibold text-amber-700">{selectedCategory}</span>
            </p>
            <button
              type="button"
              onClick={clearCategory}
              className="text-xs font-medium text-amber-700 hover:text-amber-900 underline underline-offset-2"
            >
              Tüm tarifleri göster
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-stone-800">
            {isLoading
              ? 'Tarifler yükleniyor…'
              : isError
              ? 'Tarifler'
              : selectedCategory
              ? `${selectedCategory} (${filteredRecipes?.length || 0})`
              : `Tüm Tarifler (${filteredRecipes?.length || 0})`}
          </h2>
        </div>

        {isError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-5 py-4 text-sm">
            <strong>Bir hata oluştu:</strong>{' '}
            {error instanceof Error
              ? error.message
              : 'Tarifler yüklenemedi. Lütfen tekrar deneyin.'}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))
            : filteredRecipes?.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
        </div>

        {!isLoading && !isError && filteredRecipes?.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <span className="text-5xl block mb-4" aria-hidden="true">🥄</span>
            <p className="text-base font-medium text-stone-600">
              {selectedCategory
                ? `"${selectedCategory}" kategorisinde tarif bulunamadı.`
                : 'Aradığın malzemelere uygun tarif bulunamadı.'}
            </p>
            {selectedCategory && (
              <Link
                to="/"
                className="inline-block mt-4 text-sm text-amber-600 hover:text-amber-700 underline underline-offset-2"
              >
                Tüm tarifleri göster
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
