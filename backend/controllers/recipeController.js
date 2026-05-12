const Recipe = require("../models/Recipe");

// @desc    Yeni tarif oluştur
// @route   POST /api/recipes
// @access  Private (Sadece giriş yapmış kullanıcılar)
const createRecipe = async (req, res, next) => {
  try {
    const { title, ingredients, instructions, prepTime } = req.body;

    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      prepTime,
      author: req.user._id, // JWT'den gelen kullanıcı bilgisi
    });

    res.status(201).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tüm tarifleri listele
// @route   GET /api/recipes
// @access  Public (Herkes görebilir - Anasayfa için)
const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRecipe, getAllRecipes };
