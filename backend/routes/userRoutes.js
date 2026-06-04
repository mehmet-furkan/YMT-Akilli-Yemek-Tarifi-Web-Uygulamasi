const express = require("express");
const router = express.Router();
const { 
  getUserProfile, 
  updateUserProfile, 
  updatePreferences,
  getUserStats,
  getUserRecipes,
  getUserDrafts,
  getUserSavedRecipes,
  getUserComments
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// GET  /api/users/profile      - Profili getir (Private)
// PUT  /api/users/profile      - Profili güncelle (Private)
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

// PUT  /api/users/preferences  - Beslenme tercihlerini güncelle (Private)
router.route("/preferences").put(protect, updatePreferences);

// GET /api/users/me/* - Profil sekmeleri verileri (Private)
router.route("/me/stats").get(protect, getUserStats);
router.route("/me/recipes").get(protect, getUserRecipes);
router.route("/me/drafts").get(protect, getUserDrafts);
router.route("/me/saved").get(protect, getUserSavedRecipes);
router.route("/me/comments").get(protect, getUserComments);

module.exports = router;
