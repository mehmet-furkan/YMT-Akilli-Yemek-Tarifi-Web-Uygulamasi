const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Comment = require("../models/Comment");

// @desc    Kullanıcı profilini getir
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "favorites",
      "title imageUrl prepTime difficulty"
    );

    if (!user) {
      res.status(404);
      throw new Error("Kullanıcı bulunamadı");
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Kullanıcı profilini güncelle
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("Kullanıcı bulunamadı");
    }

    // Güncellenebilir alanlar
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if (req.body.username !== undefined) user.username = req.body.username;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.city !== undefined) user.city = req.body.city;
    if (req.body.gender !== undefined) user.gender = req.body.gender;
    if (req.body.birthDate !== undefined) user.birthDate = req.body.birthDate;
    if (req.body.profilePhoto !== undefined) user.profilePhoto = req.body.profilePhoto;
    if (req.body.coverPhoto !== undefined) user.coverPhoto = req.body.coverPhoto;

    if (req.body.preferences) {
      user.preferences.diet =
        req.body.preferences.diet || user.preferences.diet;
      user.preferences.allergies =
        req.body.preferences.allergies || user.preferences.allergies;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        preferences: updatedUser.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Beslenme tercihlerini güncelle
// @route   PUT /api/users/preferences
// @access  Private
const updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("Kullanıcı bulunamadı");
    }

    const { dietaryPreferences } = req.body;

    if (!Array.isArray(dietaryPreferences)) {
      res.status(400);
      throw new Error("dietaryPreferences bir dizi olmalıdır");
    }

    user.preferences.diet = dietaryPreferences;
    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        preferences: updatedUser.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Giriş yapan kullanıcının tarif istatistiklerini getir
// @route   GET /api/users/me/stats
// @access  Private
const getUserStats = async (req, res, next) => {
  try {
    const recipesCount = await Recipe.countDocuments({ createdBy: req.user._id, status: 'published' });
    res.json({ success: true, data: { recipesCount } });
  } catch (error) {
    next(error);
  }
};

// @desc    Giriş yapan kullanıcının yayınlanmış tariflerini getir
// @route   GET /api/users/me/recipes
// @access  Private
const getUserRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user._id, status: 'published' }).sort({ createdAt: -1 });
    res.json({ success: true, data: recipes });
  } catch (error) {
    next(error);
  }
};

// @desc    Giriş yapan kullanıcının taslak tariflerini getir
// @route   GET /api/users/me/drafts
// @access  Private
const getUserDrafts = async (req, res, next) => {
  try {
    const drafts = await Recipe.find({ createdBy: req.user._id, status: 'draft' }).sort({ createdAt: -1 });
    res.json({ success: true, data: drafts });
  } catch (error) {
    next(error);
  }
};

// @desc    Giriş yapan kullanıcının kaydettiği tarifleri getir
// @route   GET /api/users/me/saved
// @access  Private
const getUserSavedRecipes = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("savedRecipes");
    if (!user) {
      res.status(404);
      throw new Error("Kullanıcı bulunamadı");
    }
    res.json({ success: true, data: user.savedRecipes });
  } catch (error) {
    next(error);
  }
};

// @desc    Giriş yapan kullanıcının yorumlarını getir
// @route   GET /api/users/me/comments
// @access  Private
const getUserComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ userId: req.user._id }).populate("recipeId", "title imageUrl").sort({ createdAt: -1 });
    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getUserProfile, 
  updateUserProfile, 
  updatePreferences, 
  getUserStats, 
  getUserRecipes, 
  getUserDrafts, 
  getUserSavedRecipes, 
  getUserComments 
};
