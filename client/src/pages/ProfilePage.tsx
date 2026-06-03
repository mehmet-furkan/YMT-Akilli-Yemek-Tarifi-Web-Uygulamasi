import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import { RecipeCard } from "../components/feature/RecipeCard";

// ─── Diyet seçenekleri (User şemasıyla birebir) ───────────────────────────

const DIETARY_OPTIONS = [
  "Vejeteryan",
  "Vegan",
  "Glutensiz",
  "Laktozsuz",
  "Helal",
  "Düşük Karbonhidrat",
] as const;

type DietaryOption = (typeof DIETARY_OPTIONS)[number];

// ─── Sekme tanımları ──────────────────────────────────────────────────────

const TABS = [
  { id: "info", label: "Bilgilerim" },
  { id: "favorites", label: "Favorilerim" },
  { id: "mealplan", label: "Yemek Planım" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Bilgilerim sekmesi ───────────────────────────────────────────────────

function InfoTab({ user }: { user: { name: string; email: string; dietaryPreferences?: string[] } }) {
  const selected: DietaryOption[] = (user.dietaryPreferences ?? []) as DietaryOption[];

  return (
    <div className="space-y-6">
      {/* Ad & E-posta (readonly v1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">
            Ad Soyad
          </label>
          <div className="px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-sm">
            {user.name}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">
            E-posta
          </label>
          <div className="px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-sm">
            {user.email}
          </div>
        </div>
      </div>

      {/* Diyet tercihleri */}
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-2">
          Beslenme Tercihleri
        </label>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((option) => {
            const active = selected.includes(option);
            return (
              <span
                key={option}
                className={`px-3 py-1.5 rounded-full text-sm font-medium select-none ${
                  active
                    ? "bg-amber-500 text-white"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                {option}
              </span>
            );
          })}
        </div>
        <p className="text-xs text-stone-400 mt-2">
          Tercihlerini güncellemek için profil düzenleme yakında gelecek.
        </p>
      </div>
    </div>
  );
}

// ─── Favorilerim sekmesi ──────────────────────────────────────────────────

function FavoritesTab() {
  const { favorites, isLoading, isError } = useFavorites();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-stone-100 h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500 text-center py-8">
        Favoriler yüklenirken bir hata oluştu.
      </p>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center py-16 text-stone-400">
        <div className="text-5xl mb-4">🤍</div>
        <p className="font-medium text-stone-500">Henüz favori tarif yok</p>
        <p className="text-sm mt-1">Bir tarifi beğenince buraya gelecek</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {favorites.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}



// ─── Yemek Planım sekmesi (v2 placeholder) ───────────────────────────────

function MealPlanTab() {
  return (
    <div className="text-center py-16 text-stone-400">
      <div className="text-5xl mb-4">📅</div>
      <p className="font-medium text-stone-500">Yemek Planı Yakında</p>
      <p className="text-sm mt-1">
        Haftalık öğün planı özelliği bir sonraki sürümde geliyor
      </p>
    </div>
  );
}

// ─── Sayfa ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("info");

  // Auth guard — ProtectedRoute bunu zaten halleder,
  // ama savunma katmanı olarak burada da kontrol et.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="min-h-screen bg-amber-50/40 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profil başlık */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-800">{user.name}</h1>
            <p className="text-sm text-stone-500">{user.email}</p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-stone-100 shadow-sm mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sekme içeriği */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          {activeTab === "info" && <InfoTab user={user} />}
          {activeTab === "favorites" && <FavoritesTab />}
          {activeTab === "mealplan" && <MealPlanTab />}
        </div>
      </div>
    </main>
  );
}
