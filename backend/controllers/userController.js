const User = require("../models/User");

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

module.exports = { getUserProfile, updateUserProfile };
