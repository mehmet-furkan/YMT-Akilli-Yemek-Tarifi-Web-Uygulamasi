const express = require("express");
const router = express.Router();
const { createRecipe, getAllRecipes } = require("../controllers/recipeController");
const { protect } = require("../middleware/authMiddleware");

// GET  /api/recipes  → Tüm tarifleri listele (Public - herkes erişebilir)
// POST /api/recipes  → Yeni tarif ekle (Private - JWT token gerekli)
router
  .route("/")
  .get(getAllRecipes)
  .post(protect, createRecipe);

module.exports = router;
