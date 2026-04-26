const express = require("express");
const router = express.Router();
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchByIngredients,
} = require("../controllers/recipeController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/recipes/search-by-ingredients (Public)
router.post("/search-by-ingredients", searchByIngredients);

// GET  /api/recipes     - Tüm tarifler (Public)
// POST /api/recipes     - Yeni tarif ekle (Private)
router.route("/").get(getRecipes).post(protect, createRecipe);

// GET    /api/recipes/:id  - Tarif detayı (Public)
// PUT    /api/recipes/:id  - Tarif güncelle (Private)
// DELETE /api/recipes/:id  - Tarif sil (Private)
router
  .route("/:id")
  .get(getRecipeById)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

module.exports = router;
