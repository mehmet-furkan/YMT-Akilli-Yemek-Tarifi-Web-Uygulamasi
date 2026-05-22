const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favorites.controller");

// Tüm favorite route'ları auth gerektirir
router.use(protect);

// GET    /api/favorites           → kullanıcının favori tarif listesi
// POST   /api/favorites/:recipeId → tarifi favoriye ekle
// DELETE /api/favorites/:recipeId → tarifi favorilerden çıkar
router.get("/", getFavorites);
router.post("/:recipeId", addFavorite);
router.delete("/:recipeId", removeFavorite);

module.exports = router;
