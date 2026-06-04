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

// Comment controller — yorum endpoint'leri tarif route'unun altında nested
const {
  getComments,
  createComment,
} = require("../controllers/comments.controller");

const { protect } = require("../middleware/authMiddleware");
const { commentLimiter } = require("../lib/rateLimiters");
const {
  createRecipeSchema,
  updateRecipeSchema,
  validate,
} = require("../lib/validation/recipe.schema");
const {
  createCommentSchema,
  validate: validateComment,
} = require("../lib/validation/comment.schema");

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
// GET  — Tarifin yorumlarını getir (Public)
// POST — Tarife yorum yap (Private + Zod validate + rate limit)
router
  .route("/:id/comments")
  .get(getComments)
  .post(commentLimiter, protect, validateComment(createCommentSchema), createComment);

module.exports = router;
