const Favorite = require("../models/Favorite");
const Recipe = require("../models/Recipe");
const asyncHandler = require("../lib/asyncHandler");

// ─────────────────────────────────────────────
// GET /api/favorites
// Giriş yapmış kullanıcının favori tariflerini listeler
// @access  Private
// ─────────────────────────────────────────────
const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user._id })
    .populate({
      path: "recipeId",
      populate: { path: "createdBy", select: "name" },
    })
    .sort({ createdAt: -1 });

  // Sadece tarif nesnelerini döndür (recipeId populate'den gelir)
  const recipes = favorites.map((fav) => fav.recipeId).filter(Boolean);

  res.json({ success: true, data: recipes });
});

// ─────────────────────────────────────────────
// POST /api/favorites/:recipeId
// Tarifi favoriye ekle — idempotent (tekrar eklemede 200 döner, 409 değil)
// @access  Private
// ─────────────────────────────────────────────
const addFavorite = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;

  // Tarif var mı kontrol et
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    res.status(404);
    throw new Error("Tarif bulunamadı");
  }

  // Zaten favoride var mı? (idempotent davranış — 409 değil 200)
  const existing = await Favorite.findOne({
    userId: req.user._id,
    recipeId,
  });

  if (existing) {
    return res.json({ success: true, data: existing });
  }

  const favorite = await Favorite.create({
    userId: req.user._id,
    recipeId,
  });

  res.status(201).json({ success: true, data: favorite });
});

// ─────────────────────────────────────────────
// DELETE /api/favorites/:recipeId
// Tarifi favorilerden çıkar
// @access  Private
// ─────────────────────────────────────────────
const removeFavorite = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;

  const favorite = await Favorite.findOneAndDelete({
    userId: req.user._id,
    recipeId,
  });

  if (!favorite) {
    res.status(404);
    throw new Error("Bu tarif favorilerinizde bulunamadı");
  }

  res.status(204).send();
});

module.exports = { getFavorites, addFavorite, removeFavorite };
