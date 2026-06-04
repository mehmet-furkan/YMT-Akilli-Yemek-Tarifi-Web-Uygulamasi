const Recipe = require("../models/Recipe");

/**
 * recommendation.service.js
 *
 * Kural tabanlı (ML değil) öneri algoritması.
 * Controller'dan bağımsız test edilebilmesi için servise çıkarıldı.
 *
 * Algoritma:
 *   1. Kullanıcının malzemelerinden en az birini içeren tarifleri DB'den çek ($in ile)
 *   2. Her tarif için eşleşme skoru hesapla:
 *        - Temel malzemeler (tuz, karabiber, nane vb.) paydadan ve eksik listesinden hariç tutulur
 *        matchedCount  = tarifteki malzemelerden kullanıcıda olan sayısı (case-insensitive)
 *        score         = Math.round((matchedCount / filteredTotal) * 100)  (0 – 100)
 *   3. score >= 20 olanları filtrele (en az 1 eşleşme zorunlu)
 *   4. score'a göre azalan sırala
 *   5. İlk `limit` tarifi döndür
 */

// Temel malzemeler: herkeste var varsayılır, eşleşme hesabından hariç tutulur
const EXCLUDED_INGREDIENTS = [
  "tuz",
  "karabiber",
  "nane",
  "pul biber",
  "kekik",
  "kimyon",
  "su",
];

/**
 * İki malzeme ismini normalize ederek kıyaslar.
 * "Domates" ile "domates" ve "domates salçası" ile "domates" eşleşebilir.
 *
 * @param {string} recipeIng  - Tariften gelen malzeme adı
 * @param {string} userIng    - Kullanıcının girdiği malzeme
 * @returns {boolean}
 */
const ingredientsMatch = (recipeIng, userIng) => {
  const r = recipeIng.toLowerCase().trim();
  const u = userIng.toLowerCase().trim();
  const boundary = "[^a-zA-Z0-9çğıöşüÇĞIÖŞÜ]";
  const regexU = new RegExp(`(^|${boundary})${u}(${boundary}|$)`, "i");
  const regexR = new RegExp(`(^|${boundary})${r}(${boundary}|$)`, "i");
  return regexU.test(r) || regexR.test(u);
};

/**
 * Bir malzeme adının temel malzeme listesinde olup olmadığını kontrol eder.
 * @param {string} name - Malzeme adı
 * @returns {boolean}
 */
const isExcluded = (name) =>
  EXCLUDED_INGREDIENTS.some((ex) => name.toLowerCase().trim().includes(ex));

/**
 * Kullanıcının elindeki malzemelere göre tarif önerir.
 *
 * @param {string[]} userIngredients - Kullanıcının girdiği malzeme isimleri
 * @param {string[]} [dietaryPreferences=[]] - Kullanıcının diyet tercihleri
 * @param {number}   [limit=20]      - Döndürülecek maksimum tarif sayısı
 * @param {number}   [minScore=20]   - Minimum eşleşme skoru (0 – 100)
 * @returns {Promise<Array>} Sıralanmış öneri nesneleri
 */
const getRecommendations = async (userIngredients, dietaryPreferences = [], limit = 20, minScore = 20) => {
  if (!userIngredients || userIngredients.length === 0) {
    return [];
  }

  const normalizedUser = userIngredients.map((i) => String(i).toLowerCase().trim());

  // 1. Diyet tercihlerine göre dışlanacak kelimeleri belirle
  const excludedKeywords = new Set();
  const prefs = Array.isArray(dietaryPreferences) ? dietaryPreferences : [];

  if (prefs.includes("Vejetaryen") || prefs.includes("Vejeteryan")) {
    ["et", "tavuk", "kıyma", "dana", "kuzu", "balık", "sucuk", "pastırma"].forEach(k => excludedKeywords.add(k));
  }
  if (prefs.includes("Vegan")) {
    ["et", "tavuk", "kıyma", "dana", "kuzu", "balık", "sucuk", "pastırma", "süt", "yumurta", "bal", "peynir", "yoğurt", "tereyağı", "krema"].forEach(k => excludedKeywords.add(k));
  }
  if (prefs.includes("Laktozsuz")) {
    ["süt", "peynir", "yoğurt", "tereyağı", "krema"].forEach(k => excludedKeywords.add(k));
  }
  if (prefs.includes("Glutensiz")) {
    ["un", "bulgur", "makarna", "şehriye", "yufka"].forEach(k => excludedKeywords.add(k));
  }

  // 2. Temel sorguyu oluştur
  const boundary = "[^a-zA-Z0-9çğıöşüÇĞIÖŞÜ]";
  const query = {
    "ingredients.name": {
      $in: normalizedUser.map((u) => new RegExp(`(^|${boundary})${u}(${boundary}|$)`, "i")),
    },
  };

  // 3. Hard filter: Dışlanacak kelimeler varsa $not ile pipeline'ın en başında ekarte et
  if (excludedKeywords.size > 0) {
    const pattern = Array.from(excludedKeywords).join("|");
    const regex = new RegExp(`(${pattern})`, "i");
    query["$and"] = [
      { "ingredients.name": { $not: regex } },
      { title: { $not: regex } }
    ];
  }

  // Performans: sadece kullanıcının malzemelerinden en az birini içeren ve kısıtlamalardan geçen tarifleri çek
  const recipes = await Recipe.find(query).populate("createdBy", "name");

  const scored = recipes
    .map((recipe) => {
      const recipeIngs = recipe.ingredients.map((i) => i.name);

      // Temel malzemeleri filtrele — paydaya ve eksik listesine dahil etme
      const filteredIngs = recipeIngs.filter((r) => !isExcluded(r));
      const total = filteredIngs.length;

      if (total === 0) return null;

      const matchedIngredients = normalizedUser.filter((u) =>
        filteredIngs.some((r) => ingredientsMatch(r, u))
      );

      // Eksik malzemeler: temel malzemeler hariç, kullanıcıda olmayanlar
      const missingIngredients = filteredIngs.filter(
        (r) => !normalizedUser.some((u) => ingredientsMatch(r, u))
      );

      // Skor: 0–100 arası tam sayı
      const score = Math.round((matchedIngredients.length / total) * 100);

      return {
        recipe,
        score,
        matchedIngredients,
        missingIngredients,
      };
    })
    .filter((r) => r !== null && r.matchedIngredients.length > 0 && r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
};

module.exports = { getRecommendations };
