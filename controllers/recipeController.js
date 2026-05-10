const Recipe = require("../models/Recipe");

// Tüm tarifleri getir
const getRecipes = async (req, res) => {
  const recipes = await Recipe.find({});
  res.json(recipes);
};

// Malzemeye göre akıllı arama
const searchByIngredients = async (req, res) => {
  const { ingredients } = req.body;
  const recipes = await Recipe.find({});

  const matchedRecipes = recipes.map((recipe) => {
    const recipeIngredients = recipe.ingredients.map((ing) => ing.name.toLowerCase());
    const matched = ingredients.filter((ing) => recipeIngredients.includes(ing.toLowerCase()));
    const score = (matched.length / recipe.ingredients.length) * 100;

    return { ...recipe._doc, matchScore: score.toFixed(2), matchedIngredients: matched };
  }).filter((recipe) => recipe.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);

  res.json(matchedRecipes);
};

module.exports = { getRecipes, searchByIngredients };