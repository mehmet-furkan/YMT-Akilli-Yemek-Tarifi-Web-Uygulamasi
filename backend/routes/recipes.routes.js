const express = require("express");
const router = express.Router();

const {
  getRecipes,
  getRecipeById,
  getRandomRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchByIngredients,
} = require("../controllers/recipes.controller");

// 1. Yorum controller'ından GET ve POST fonksiyonlarını çekiyoruz
const {
  getComments,
  createComment,
} = require("../controllers/comments.controller");

const { protect } = require("../middleware/authMiddleware");
const {
  createRecipeSchema,
  updateRecipeSchema,
  validate,
} = require("../lib/validation/recipe.schema");

// ── /api/recipes/search-by-ingredients ────────
router.post("/search-by-ingredients", searchByIngredients);

// ── /api/recipes/random ───────────────────────
// GET — Rastgele 1 tarif döner (Public)
router.get("/random", getRandomRecipe);

// ── /api/recipes ──────────────────────────────
router
  .route("/")
  .get(getRecipes)
  .post(protect, validate(createRecipeSchema), createRecipe);

// ── /api/recipes/:id ──────────────────────────
router
  .route("/:id")
  .get(getRecipeById)
  .put(protect, validate(updateRecipeSchema), updateRecipe)
  .delete(protect, deleteRecipe);

// ── /api/recipes/:id/comments ─────────────────
// GET: Tarifin yorumlarını getir (Public - herkes görebilir)
// POST: Tarife yorum yap (Private - sadece giriş yapanlar)
router
  .route("/:id/comments")
  .get(getComments)
  .post(protect, createComment);

module.exports = router;