const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// GET  /api/users/profile  - Profili getir (Private)
// PUT  /api/users/profile  - Profili güncelle (Private)
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
