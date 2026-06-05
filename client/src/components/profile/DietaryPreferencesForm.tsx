import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { useAuth } from '../../hooks/useAuth';

const DIETARY_OPTIONS = [
  "Vejeteryan",
  "Vegan",
  "Glutensiz",
  "Laktozsuz",
  "Helal",
  "Düşük Karbonhidrat",
] as const;

export function DietaryPreferencesForm() {
  const { user, setUser } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (user?.preferences?.diet) {
      setSelected(user.preferences.diet);
    }
  }, [user]);

  function toggleOption(option: string) {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
    setSaveStatus("idle");
  }

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      // The backend route is PUT /api/users/preferences
      const { data } = await api.put("/users/preferences", {
        dietaryPreferences: selected,
      });
      if (data.success) {
        setUser({
          ...user!,
          preferences: { ...user!.preferences, diet: selected },
        });
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (err) {
      console.error("Diet update error:", err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const initialDiet = user?.preferences?.diet || [];
  const hasChanges =
    JSON.stringify([...selected].sort()) !==
    JSON.stringify([...initialDiet].sort());

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-stone-800">Beslenme Tercihleri</h2>
        {saveStatus === "success" && (
          <span className="text-sm font-medium text-emerald-600 animate-[fadeIn_0.3s_ease-out]">
            ✓ Tercihler kaydedildi
          </span>
        )}
        {saveStatus === "error" && (
          <span className="text-sm font-medium text-rose-500">
            ✕ Kaydetme başarısız oldu
          </span>
        )}
      </div>

      <div className="mb-8">
        <p className="text-sm text-stone-600 mb-4">
          Sana daha uygun tarifler önerebilmemiz için beslenme tercihlerini işaretle.
        </p>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((option) => {
            const active = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleOption(option)}
                className={`px-4 py-2 rounded-full text-sm font-medium select-none transition-all duration-200 ${
                  active
                    ? "bg-amber-500 text-white shadow-sm hover:bg-amber-600"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-800"
                }`}
              >
                {active && "✓ "}
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:cursor-not-allowed text-white font-semibold text-sm px-8 py-3 rounded-xl transition-colors shadow-sm"
        >
          {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </div>
  );
}
