import { useState, useCallback } from "react";
import apiClient from "../lib/axios";
import type { ApiResponse } from "../contexts/AuthContext";

// ─── Tipler ───────────────────────────────────────────────────────────────────

interface Recipe {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  cookTime?: number;
  servings?: number;
  ingredients: string[];
  matchCount?: number;
}

// ─── Sabit veri ───────────────────────────────────────────────────────────────

const SUGGESTED = [
  "Tavuk","Kıyma","Soğan","Sarımsak","Domates","Biber",
  "Patates","Havuç","Patlıcan","Kabak","Ispanak","Mantar",
  "Yumurta","Peynir","Süt","Tereyağı","Zeytinyağı","Un",
  "Pirinç","Makarna","Mercimek","Nohut","Fasulye","Maydanoz",
  "Nane","Kekik","Pul biber","Kimyon","Limon","Salça",
];

// ─── Paylaşılan renkler ───────────────────────────────────────────────────────

const BRAND = "#f97316";
const BG = "#0f172a";
const CARD_BG = "rgba(30,41,59,0.9)";
const BORDER = "#1e3a5f";
const TEXT = "#e2e8f0";
const MUTED = "#64748b";

// ─── Ana Bileşen ──────────────────────────────────────────────────────────────

export default function IngredientSearchPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [addHover, setAddHover] = useState(false);

  const toggle = useCallback((item: string) => {
    setSelected((p) => p.includes(item) ? p.filter((i) => i !== item) : [...p, item]);
  }, []);

  const addCustom = useCallback(() => {
    const t = customInput.trim();
    if (!t || selected.includes(t)) { setCustomInput(""); return; }
    setSelected((p) => [...p, t]);
    setCustomInput("");
  }, [customInput, selected]);

  const remove = useCallback((item: string) => {
    setSelected((p) => p.filter((i) => i !== item));
  }, []);

  const handleSearch = async () => {
    if (selected.length === 0) return;
    setIsLoading(true); setError(null); setHasSearched(true);
    try {
      const res = await apiClient.post<ApiResponse<Recipe[]>>(
        "/recipes/search-by-ingredients",
        { ingredients: selected }
      );
      setRecipes(res.data.data);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Tarif aranırken bir hata oluştu."
      );
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${BG} 0%, #0d1f3c 60%, ${BG} 100%)`, padding: "40px 20px", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", color: TEXT }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>

        {/* ── Başlık ── */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{ fontSize: "60px", display: "block", marginBottom: "16px", filter: "drop-shadow(0 8px 20px rgba(249,115,22,0.5))" }}>🥘</span>
          <h1 style={{ fontSize: "32px", fontWeight: 900, background: "linear-gradient(90deg,#fb923c,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: "0 0 10px", letterSpacing: "-1px" }}>
            Malzemeye Göre Tarif Bul
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "15px", margin: 0 }}>
            Elinizdeki malzemeleri seçin, size özel tarifleri keşfedin.
          </p>
        </div>

        {/* ── Malzeme Seçim Paneli ── */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: "20px", padding: "28px", boxShadow: "0 20px 50px rgba(0,0,0,0.4)", marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "16px" }}>
            Popüler Malzemeler
          </p>

          {/* Chip Grid */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {SUGGESTED.map((item) => {
              const active = selected.includes(item);
              return (
                <button
                  key={item}
                  id={`ingredient-${item}`}
                  type="button"
                  onClick={() => toggle(item)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "999px",
                    border: active ? `1.5px solid ${BRAND}` : "1.5px solid #2d3f55",
                    background: active ? "rgba(249,115,22,0.15)" : "rgba(15,23,42,0.6)",
                    color: active ? "#fb923c" : "#94a3b8",
                    fontSize: "13px",
                    fontWeight: active ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    boxShadow: active ? "0 0 10px rgba(249,115,22,0.2)" : "none",
                  }}
                >
                  {active ? "✓ " : ""}{item}
                </button>
              );
            })}
          </div>

          {/* Özel girdi */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <input
              id="custom-ingredient-input"
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              placeholder="Başka malzeme ekle… (Enter)"
              style={{ flex: 1, background: "rgba(15,23,42,0.7)", border: "1.5px solid #2d3f55", borderRadius: "12px", padding: "11px 16px", fontSize: "14px", color: TEXT, outline: "none" }}
            />
            <button
              id="add-custom-ingredient-btn"
              type="button"
              onClick={addCustom}
              disabled={!customInput.trim()}
              onMouseEnter={() => setAddHover(true)}
              onMouseLeave={() => setAddHover(false)}
              style={{ padding: "11px 20px", borderRadius: "12px", border: `1.5px solid ${BRAND}`, background: addHover ? "rgba(249,115,22,0.2)" : "rgba(249,115,22,0.08)", color: "#fb923c", fontSize: "14px", fontWeight: 600, cursor: customInput.trim() ? "pointer" : "not-allowed", opacity: customInput.trim() ? 1 : 0.4, transition: "all 0.15s", whiteSpace: "nowrap" }}
            >
              + Ekle
            </button>
          </div>
        </div>

        {/* ── Seçilenler ── */}
        {selected.length > 0 && (
          <div style={{ background: "rgba(20,30,50,0.7)", border: "1px solid #1e3a5f", borderRadius: "16px", padding: "16px 20px", marginBottom: "16px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px" }}>
              Seçilenler ({selected.length})
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {selected.map((item) => (
                <span key={item} style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.35)", borderRadius: "999px", padding: "5px 12px", fontSize: "13px", color: "#fb923c" }}>
                  {item}
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    aria-label={`${item} kaldır`}
                    style={{ background: "none", border: "none", color: "#fb923c", cursor: "pointer", fontSize: "15px", lineHeight: 1, padding: "0 2px", opacity: 0.7 }}
                  >×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Tarif Bul Butonu ── */}
        <button
          id="search-recipes-btn"
          type="button"
          onClick={handleSearch}
          disabled={selected.length === 0 || isLoading}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            width: "100%", padding: "16px", borderRadius: "14px", border: "none",
            background: selected.length === 0 || isLoading ? "#1e3a5f" : "linear-gradient(135deg,#f97316,#ea580c)",
            color: selected.length === 0 || isLoading ? MUTED : "#fff",
            fontSize: "16px", fontWeight: 800, cursor: selected.length === 0 || isLoading ? "not-allowed" : "pointer",
            boxShadow: btnHover && selected.length > 0 && !isLoading ? "0 8px 32px rgba(249,115,22,0.5)" : "0 4px 20px rgba(249,115,22,0.2)",
            transform: btnHover && selected.length > 0 && !isLoading ? "translateY(-2px)" : "none",
            transition: "all 0.2s", letterSpacing: "0.3px",
          }}
        >
          {isLoading
            ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <span style={{ display: "inline-block", width: "18px", height: "18px", border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Tarif aranıyor…
              </span>
            : "🍽️  Tarif Bul"}
        </button>

        {/* ── Hata ── */}
        {error && (
          <div style={{ marginTop: "20px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: "14px", padding: "14px 18px", color: "#fca5a5", fontSize: "14px" }}>
            ❌ {error}
          </div>
        )}

        {/* ── Sonuçlar ── */}
        {hasSearched && !isLoading && !error && (
          <section style={{ marginTop: "40px" }}>
            {recipes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: "20px" }}>
                <p style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</p>
                <p style={{ color: "#94a3b8", fontSize: "16px", marginBottom: "6px" }}>Bu kombinasyona uygun tarif bulunamadı.</p>
                <p style={{ color: MUTED, fontSize: "13px" }}>Farklı malzeme seçimleri deneyin.</p>
              </div>
            ) : (
              <>
                <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>
                  <span style={{ color: BRAND, fontWeight: 700 }}>{recipes.length}</span> tarif bulundu
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "20px" }}>
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} selected={selected} />
                  ))}
                </div>
              </>
            )}
          </section>
        )}
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Tarif Kartı ──────────────────────────────────────────────────────────────

function RecipeCard({ recipe, selected }: { recipe: Recipe; selected: string[] }) {
  const [hover, setHover] = useState(false);

  const matchCount =
    recipe.matchCount ??
    recipe.ingredients.filter((ing) =>
      selected.some((s) => ing.toLowerCase().includes(s.toLowerCase()))
    ).length;

  const matchPct =
    recipe.ingredients.length > 0
      ? Math.round((matchCount / recipe.ingredients.length) * 100)
      : 0;

  return (
    <article
      id={`recipe-card-${recipe._id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "rgba(22,33,55,0.95)",
        border: hover ? "1px solid rgba(249,115,22,0.4)" : "1px solid #1e3a5f",
        borderRadius: "18px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: hover ? "0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(249,115,22,0.08)" : "0 8px 24px rgba(0,0,0,0.3)",
        transform: hover ? "translateY(-4px)" : "none",
        transition: "all 0.25s ease",
        cursor: "default",
      }}
    >
      {/* Görsel */}
      <div style={{ position: "relative", height: "180px", background: "#0f1f35", overflow: "hidden" }}>
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: hover ? "scale(1.06)" : "scale(1)", transition: "transform 0.4s ease" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "56px", opacity: 0.25 }}>🍲</div>
        )}

        {/* Gradient overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to top,rgba(22,33,55,0.9),transparent)" }} />

        {/* Eşleşme rozeti */}
        {matchCount > 0 && (
          <span style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(10,15,30,0.85)", border: "1px solid rgba(249,115,22,0.4)", borderRadius: "999px", padding: "4px 10px", fontSize: "11px", fontWeight: 700, color: "#fb923c", backdropFilter: "blur(8px)" }}>
            %{matchPct} eşleşme
          </span>
        )}
      </div>

      {/* İçerik */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: hover ? "#fb923c" : "#e2e8f0", margin: "0 0 6px", transition: "color 0.2s", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {recipe.title}
        </h3>

        {recipe.description && (
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {recipe.description}
          </p>
        )}

        {/* Meta */}
        <div style={{ display: "flex", gap: "14px", fontSize: "12px", color: "#475569", marginBottom: "12px", flexWrap: "wrap" }}>
          {recipe.cookTime != null && <span>⏱ {recipe.cookTime} dk</span>}
          {recipe.servings != null && <span>👤 {recipe.servings} kişilik</span>}
          {recipe.ingredients.length > 0 && <span>🧄 {recipe.ingredients.length} malzeme</span>}
        </div>

        {/* Malzeme etiketleri */}
        {recipe.ingredients.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "auto" }}>
            {recipe.ingredients.slice(0, 5).map((ing) => {
              const isMatch = selected.some((s) => ing.toLowerCase().includes(s.toLowerCase()));
              return (
                <span key={ing} style={{
                  padding: "3px 9px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  background: isMatch ? "rgba(249,115,22,0.15)" : "rgba(15,23,42,0.6)",
                  color: isMatch ? "#fb923c" : "#475569",
                  border: isMatch ? "1px solid rgba(249,115,22,0.3)" : "1px solid #1e3a5f",
                }}>
                  {ing}
                </span>
              );
            })}
            {recipe.ingredients.length > 5 && (
              <span style={{ padding: "3px 9px", borderRadius: "999px", fontSize: "11px", background: "rgba(15,23,42,0.6)", color: "#334155", border: "1px solid #1e3a5f" }}>
                +{recipe.ingredients.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

