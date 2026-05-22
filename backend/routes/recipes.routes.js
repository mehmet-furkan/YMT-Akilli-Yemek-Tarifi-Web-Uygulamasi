const express = require("express");
const router = express.Router();

const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchByIngredients,
} = require("../controllers/recipes.controller");

const { protect } = require("../middleware/authMiddleware");
const {
  createRecipeSchema,
  updateRecipeSchema,
  validate,
} = require("../lib/validation/recipe.schema");

// ── /api/recipes/search-by-ingredients ────────
// POST — Malzemelere göre tarif ara, eşleşme skoruyla (Public)
// NOT: "/:id" route'undan ÖNCE tanımlı olmalı, aksi halde :id yakalar.
router.post("/search-by-ingredients", searchByIngredients);

// ── /api/recipes ──────────────────────────────
// GET    — Tarifleri listele (Public)
// POST   — Yeni tarif oluştur (Private + Zod validate)
router
  .route("/")
  .get(getRecipes)
  .post(protect, validate(createRecipeSchema), createRecipe);

// ── /api/recipes/:id ──────────────────────────
// GET    — Tarif detayı (Public)
// PUT    — Tarif güncelle (Private + owner + Zod validate)
// DELETE — Tarif sil (Private + owner)
router
  .route("/:id")
  .get(getRecipeById)
  .put(protect, validate(updateRecipeSchema), updateRecipe)
  .delete(protect, deleteRecipe);

module.exports = router;
