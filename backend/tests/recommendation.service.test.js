/**
 * recommendation.service.test.js
 *
 * Öneri motoru birim testleri (Jest).
 * Proje Planı Görev 2.3 — "Boş input, eşleşmeyen malzeme,
 * kısmi eşleşme, tam eşleşme" senaryoları.
 *
 * NOT: Bu testler DB bağlantısı gerektirmez.
 * getRecommendations çağrısı Recipe.find üzerine mock'lanmıştır.
 */

const { getRecommendations } = require("../services/recommendation.service");
const Recipe = require("../models/Recipe");

// Recipe.find'ı mock'la — gerçek DB'ye bağlanma
jest.mock("../models/Recipe");

// Test verisi — tipik Mongoose dökümanı gibi davranır
const mockRecipes = [
  {
    _id: "r1",
    title: "Menemen",
    ingredients: [
      { name: "domates", amount: "2", optional: false },
      { name: "biber", amount: "1", optional: false },
      { name: "yumurta", amount: "3", optional: false },
      { name: "soğan", amount: "1", optional: false },
    ],
    createdBy: { name: "Ahmet" },
  },
  {
    _id: "r2",
    title: "Omlet",
    ingredients: [
      { name: "yumurta", amount: "2", optional: false },
      { name: "tereyağı", amount: "1", optional: false },
    ],
    createdBy: { name: "Ayşe" },
  },
  {
    _id: "r3",
    title: "Mercimek Çorbası",
    ingredients: [
      { name: "kırmızı mercimek", amount: "1 su bardağı", optional: false },
      { name: "soğan", amount: "1", optional: false },
      { name: "havuç", amount: "1", optional: false },
      { name: "tuz", amount: "1 çay kaşığı", optional: false },
    ],
    createdBy: { name: "Fatma" },
  },
];

// populate() zinciri: Recipe.find().populate() döner
const mockPopulate = jest.fn().mockResolvedValue(mockRecipes);
Recipe.find.mockReturnValue({ populate: mockPopulate });

// ─── Test Setleri ───────────────────────────────────────────────────────────

describe("recommendation.service — getRecommendations", () => {
  beforeEach(() => {
    // Her testten önce mock'ları resetle
    Recipe.find.mockReturnValue({ populate: mockPopulate });
    mockPopulate.mockResolvedValue(mockRecipes);
  });

  // --- 1. Boş input ---
  it("boş malzeme listesi verilince boş dizi döner", async () => {
    const result = await getRecommendations([]);
    expect(result).toEqual([]);
    // DB çağrısı yapılmamalı
    expect(Recipe.find).not.toHaveBeenCalled();
  });

  it("null input verilince boş dizi döner", async () => {
    const result = await getRecommendations(null);
    expect(result).toEqual([]);
  });

  // --- 2. Eşleşmeyen malzemeler ---
  it("hiç eşleşmeyen malzemeler için boş dizi döner", async () => {
    // DB'den hiç kayıt döndürme (eşleşme yok senaryosu)
    mockPopulate.mockResolvedValueOnce([]);

    const result = await getRecommendations(["elma", "armut", "üzüm"]);
    expect(result).toEqual([]);
  });

  // --- 3. Kısmi eşleşme ve skor kontrolü ---
  it("kısmi eşleşmede doğru skor hesaplanır", async () => {
    // Sadece omlet dönsün (2 malzeme, 1 eşleşme → score = 50)
    const omletOnly = [mockRecipes[1]]; // Omlet: yumurta + tereyağı
    mockPopulate.mockResolvedValueOnce(omletOnly);

    const result = await getRecommendations(["yumurta"]); // 1/2 = 50
    expect(result).toHaveLength(1);
    expect(result[0].score).toBe(50);
    expect(result[0].matchedIngredients).toContain("yumurta");
    expect(result[0].missingIngredients).toContain("tereyağı");
  });

  // --- 4. Tam eşleşme — score 100 ---
  it("tüm malzemeler eşleşince score 100 döner", async () => {
    const omletOnly = [mockRecipes[1]]; // Omlet: yumurta + tereyağı
    mockPopulate.mockResolvedValueOnce(omletOnly);

    const result = await getRecommendations(["yumurta", "tereyağı"]);
    expect(result).toHaveLength(1);
    expect(result[0].score).toBe(100);
    expect(result[0].missingIngredients).toHaveLength(0);
    expect(result[0].recipe.title).toBe("Omlet");
  });

  // --- 5. Sıralama: yüksek skor önce ---
  it("sonuçlar score'a göre azalan sırayla gelir", async () => {
    // Menemen (4 malzeme) + Omlet (2 malzeme) — "yumurta" ve "soğan" verilince:
    // Omlet: yumurta eşleşir (1/2 = 50)
    // Menemen: yumurta + soğan eşleşir (2/4 = 50) — eşit puan
    const twoRecipes = [mockRecipes[0], mockRecipes[1]]; // Menemen + Omlet
    mockPopulate.mockResolvedValueOnce(twoRecipes);

    const result = await getRecommendations(["domates", "biber", "yumurta", "soğan"]);
    // Menemen: 4/4 = 100, Omlet: 1/2 = 50 → Menemen önce gelmeli
    expect(result[0].recipe.title).toBe("Menemen");
    expect(result[0].score).toBe(100);
    expect(result[1].score).toBeLessThan(100);
  });

  // --- 6. minScore filtresi — 20 altı düşer ---
  it("score < 20 olan tarifler sonuçlara dahil edilmez", async () => {
    // Mercimek çorbası (4 malzeme, 'tuz' hariç tutulur → 3 malzeme),
    // sadece 1 malzeme var → 1/3 ≈ 33 >= 20 → sonuçta görünmeli
    const mercimekOnly = [mockRecipes[2]];
    mockPopulate.mockResolvedValueOnce(mercimekOnly);

    const result = await getRecommendations(["soğan"]); // 1/3 ≈ 33
    expect(result).toHaveLength(1);
    expect(result[0].score).toBe(33);
  });

  it("score < 20 olan tarifler gerçekten düşer", async () => {
    // 10 malzemeli tarif, sadece 1 eşleşme → 10% < 20%
    const bigRecipe = [{
      _id: "r4",
      title: "Karmaşık",
      ingredients: [
        { name: "domates", amount: "1", optional: false },
        { name: "biber", amount: "1", optional: false },
        { name: "patlıcan", amount: "1", optional: false },
        { name: "kabak", amount: "1", optional: false },
        { name: "havuc", amount: "1", optional: false },
        { name: "fasulye", amount: "1", optional: false },
        { name: "bezelye", amount: "1", optional: false },
        { name: "mantar", amount: "1", optional: false },
        { name: "makarna", amount: "1", optional: false },
        { name: "peynir", amount: "1", optional: false },
      ],
      createdBy: { name: "Test" },
    }];
    mockPopulate.mockResolvedValueOnce(bigRecipe);

    const result = await getRecommendations(["domates"]); // 1/10 = 10%
    expect(result).toHaveLength(0);
  });

  // --- 7. Limit kontrolü ---
  it("limit parametresi kadar sonuç döner", async () => {
    // Tüm tarifleri döndür, limit=2
    mockPopulate.mockResolvedValueOnce(mockRecipes);

    const result = await getRecommendations(
      ["domates", "biber", "yumurta", "soğan", "kırmızı mercimek", "havuç", "tuz"],
      [], // dietaryPreferences
      2 // limit
    );
    expect(result.length).toBeLessThanOrEqual(2);
  });
});
