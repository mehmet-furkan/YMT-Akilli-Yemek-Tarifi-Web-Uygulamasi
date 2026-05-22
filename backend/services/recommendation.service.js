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
 *        matchedCount  = tarifteki malzemelerden kullanıcıda olan sayısı (case-insensitive)
 *        score         = matchedCount / recipe.ingredients.length (0.0 – 1.0)
 *   3. score >= 0.5 olanları filtrele
 *   4. score'a göre azalan sırala
 *   5. İlk `limit` tarifi döndür
 */

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
  return r.includes(u) || u.includes(r);
};

/**
 * Kullanıcının elindeki malzemelere göre tarif önerir.
 *
 * @param {string[]} userIngredients - Kullanıcının girdiği malzeme isimleri
 * @param {number}   [limit=10]      - Döndürülecek maksimum tarif sayısı
 * @param {number}   [minScore=0.5]  - Minimum eşleşme skoru (0.0 – 1.0)
 * @returns {Promise<Array>} Sıralanmış öneri nesneleri
 */
const getRecommendations = async (userIngredients, limit = 10, minScore = 0.5) => {
  if (!userIngredients || userIngredients.length === 0) {
    return [];
  }

  const normalizedUser = userIngredients.map((i) => String(i).toLowerCase().trim());

  // Performans: sadece kullanıcının malzemelerinden en az birini içeren tarifleri çek
  const recipes = await Recipe.find({
    "ingredients.name": {
      $in: normalizedUser.map((u) => new RegExp(u, "i")),
    },
  }).populate("createdBy", "name");

  const scored = recipes
    .map((recipe) => {
      const recipeIngs = recipe.ingredients.map((i) => i.name);
      const total = recipeIngs.length;

      if (total === 0) return null;

      const matchedIngredients = normalizedUser.filter((u) =>
        recipeIngs.some((r) => ingredientsMatch(r, u))
      );

      const missingIngredients = recipeIngs.filter(
        (r) => !normalizedUser.some((u) => ingredientsMatch(r, u))
      );

      const score = parseFloat((matchedIngredients.length / total).toFixed(2));

      return {
        recipe,
        score,
        matchedIngredients,
        missingIngredients,
      };
    })
    .filter((r) => r !== null && r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
};

module.exports = { getRecommendations };
