const Recipe = require("../models/Recipe");

// @desc    Tüm tarifleri listele
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: recipes.length, data: recipes });
  } catch (error) {
    next(error);
  }
};

// @desc    Tek bir tarif detayı
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("createdBy", "name");
    if (!recipe) {
      res.status(404);
      throw new Error("Tarif bulunamadı");
    }
    res.json({ success: true, data: recipe });
  } catch (error) {
    next(error);
  }
};

// @desc    Yeni tarif oluştur
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: recipe });
  } catch (error) {
    next(error);
  }
};

// @desc    Tarif güncelle
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = async (req, res, next) => {
  try {
    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) { res.status(404); throw new Error("Tarif bulunamadı"); }
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      res.status(403); throw new Error("Bu tarifi güncelleme yetkiniz yok");
    }
    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: recipe });
  } catch (error) {
    next(error);
  }
};

// @desc    Tarif sil
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) { res.status(404); throw new Error("Tarif bulunamadı"); }
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      res.status(403); throw new Error("Bu tarifi silme yetkiniz yok");
    }
    await recipe.deleteOne();
    res.json({ success: true, message: "Tarif başarıyla silindi" });
  } catch (error) {
    next(error);
  }
};

// @desc    Malzemelere göre tarif ara
// @route   POST /api/recipes/search-by-ingredients
// @access  Public
const searchByIngredients = async (req, res, next) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients || ingredients.length === 0) {
      res.status(400); throw new Error("En az bir malzeme girilmelidir");
    }
    const searchIngs = ingredients.map((i) => i.toLowerCase());
    const allRecipes = await Recipe.find().populate("createdBy", "name");

    const scored = allRecipes.map((recipe) => {
      const recipeIngs = recipe.ingredients.map((i) => i.name.toLowerCase());
      const matched = searchIngs.filter((si) => recipeIngs.some((ri) => ri.includes(si) || si.includes(ri))).length;
      const missing = recipe.ingredients.filter((i) => !i.optional && !searchIngs.some((si) => i.name.toLowerCase().includes(si) || si.includes(i.name.toLowerCase())));
      const required = recipe.ingredients.filter((i) => !i.optional);
      const pct = required.length > 0 ? Math.round(((required.length - missing.length) / required.length) * 100) : 0;
      return { recipe, matchedCount: matched, missingIngredients: missing.map((i) => i.name), matchPercentage: pct };
    }).filter((i) => i.matchedCount > 0).sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({ success: true, count: scored.length, data: scored });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, searchByIngredients };
