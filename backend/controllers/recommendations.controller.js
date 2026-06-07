const asyncHandler = require("../lib/asyncHandler");
const { getRecommendations } = require("../services/recommendation.service");

// ─────────────────────────────────────────────
// POST /api/recommendations
// Elindeki malzemelere göre tarif öner (Public)
// Body: { ingredients: string[] }
// ─────────────────────────────────────────────
const recommend = asyncHandler(async (req, res) => {
  const { ingredients, dietaryPreferences, category } = req.body;

  // Validation: en az 1 malzeme zorunlu
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    res.status(400);
    throw new Error("En az bir malzeme girilmelidir");
  }

  // Kategori: body'den veya query param'dan alınabilir
  const selectedCategory = category || req.query.category || null;

  const results = await getRecommendations(ingredients, dietaryPreferences, {
    category: selectedCategory,
  });

  res.json({
    success: true,
    count: results.length,
    data: results,
  });
});

module.exports = { recommend };
