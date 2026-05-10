const express = require("express");
const router = express.Router();
const { getRecipes, searchByIngredients } = require("../controllers/recipeController");

router.get("/", getRecipes);
router.post("/search", searchByIngredients);

module.exports = router;