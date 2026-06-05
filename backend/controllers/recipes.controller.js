const Recipe = require("../models/Recipe");
const asyncHandler = require("../lib/asyncHandler");

// ─────────────────────────────────────────────
// GET /api/recipes
// Tarifleri listele — arama, filtreleme, sayfalama
// ─────────────────────────────────────────────
const getRecipes = asyncHandler(async (req, res) => {
  const {
    search,
    ingredient,
    category,
    maxCookTime,
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {};

  // 1) Text search — MongoDB $text (Recipe.title text index)
  if (search) {
    filter.$text = { $search: search };
  }

  // 2) Malzeme filtresi — ?ingredient=domates&ingredient=biber
  //    Birden fazla ingredient → $all (tüm malzemeler olsun)
  if (ingredient) {
    const ingredients = Array.isArray(ingredient) ? ingredient : [ingredient];
    // Case-insensitive ve word-boundary (tam kelime) regex ile eşleştirme (Türkçe uyumlu)
    const boundary = "[^a-zA-Z0-9çğıöşüÇĞIÖŞÜ]";
    filter["ingredients.name"] = {
      $all: ingredients.map((i) => new RegExp(`(^|${boundary})${i}(${boundary}|$)`, "i")),
    };
  }

  // 3) Kategori filtresi
  if (category) {
    filter.category = category;
  }

  // 4) Maksimum pişirme süresi
  if (maxCookTime) {
    filter.cookTime = { $lte: Number(maxCookTime) };
  }

  // Sayfalama hesaplamaları
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Math.min(100, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  // Paralel sorgular: veri + toplam sayı
  const [data, total] = await Promise.all([
    Recipe.find(filter)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Recipe.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.json({
    success: true,
    data,
    meta: {
      total,
      page: pageNum,
      totalPages,
      limit: limitNum,
    },
  });
});

// ─────────────────────────────────────────────
// GET /api/recipes/:id
// Tek tarif detayı, populate createdBy (sadece name)
// ─────────────────────────────────────────────
const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate(
    "createdBy",
    "name"
  );

  if (!recipe) {
    res.status(404);
    throw new Error("Tarif bulunamadı");
  }

  res.json({ success: true, data: recipe });
});

// ─────────────────────────────────────────────
// POST /api/recipes
// Yeni tarif oluştur — auth required, zod validated
// ─────────────────────────────────────────────
const createRecipe = asyncHandler(async (req, res) => {
  // req.body zaten validate middleware tarafından temizlenmiş
  const recipe = await Recipe.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: recipe });
});

// ─────────────────────────────────────────────
// PUT /api/recipes/:id
// Tarif güncelle — auth + owner check
// ─────────────────────────────────────────────
const updateRecipe = asyncHandler(async (req, res) => {
  let recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error("Tarif bulunamadı");
  }

  // Sahiplik kontrolü
  if (recipe.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Bu tarifi güncelleme yetkiniz yok");
  }

  recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: recipe });
});

// ─────────────────────────────────────────────
// DELETE /api/recipes/:id
// Tarif sil — auth + owner check
// ─────────────────────────────────────────────
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error("Tarif bulunamadı");
  }

  // Sahiplik kontrolü
  if (recipe.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Bu tarifi silme yetkiniz yok");
  }

  await recipe.deleteOne();

  // OpenAPI spec: 204 No Content
  res.status(204).send();
});

// ─────────────────────────────────────────────
// GET /api/recipes/random
// Rastgele 1 tarif döner — $sample aggregation
// ─────────────────────────────────────────────
const getRandomRecipe = asyncHandler(async (req, res) => {
  const [recipe] = await Recipe.aggregate([
    { $sample: { size: 1 } },
  ]);

  if (!recipe) {
    res.status(404);
    throw new Error("Henüz hiç tarif yok");
  }

  res.json({ success: true, data: recipe });
});

// ─────────────────────────────────────────────
// POST /api/recipes/search-by-ingredients
// Malzemelere göre tarif ara — eşleşme skoruyla (Public)
// ─────────────────────────────────────────────
const searchByIngredients = asyncHandler(async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    res.status(400);
    throw new Error("En az bir malzeme girilmelidir");
  }

  const searchIngs = ingredients.map((i) => String(i).toLowerCase());
  const allRecipes = await Recipe.find().populate("createdBy", "name");

  // Tam kelime eşleşmesi için yardımcı fonksiyon (Türkçe karakter destekli)
  const isExactMatch = (recipeIng, searchIng) => {
    const boundary = "[^a-zA-Z0-9çğıöşüÇĞIÖŞÜ]";
    const regexU = new RegExp(`(^|${boundary})${searchIng}(${boundary}|$)`, "i");
    const regexR = new RegExp(`(^|${boundary})${recipeIng}(${boundary}|$)`, "i");
    return regexU.test(recipeIng) || regexR.test(searchIng);
  };

  const scored = allRecipes
    .map((recipe) => {
      const recipeIngs = recipe.ingredients.map((i) => i.name.toLowerCase());
      const matchedCount = searchIngs.filter((si) =>
        recipeIngs.some((ri) => isExactMatch(ri, si))
      ).length;

      const required = recipe.ingredients.filter((i) => !i.optional);
      const missing = required.filter(
        (i) =>
          !searchIngs.some(
            (si) => isExactMatch(i.name.toLowerCase(), si)
          )
      );

      const matchPercentage =
        required.length > 0
          ? Math.round(
              ((required.length - missing.length) / required.length) * 100
            )
          : 0;

      return {
        recipe,
        matchedCount,
        missingIngredients: missing.map((i) => i.name),
        matchPercentage,
      };
    })
    .filter((r) => r.matchedCount > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  res.json({ success: true, count: scored.length, data: scored });
});

module.exports = {
  getRecipes,
  getRecipeById,
  getRandomRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchByIngredients,
};
