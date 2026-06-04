const express = require("express");
const router = express.Router();
const { deleteComment } = require("../controllers/comments.controller");
const { protect } = require("../middleware/authMiddleware");

// ── /api/comments/:id ─────────────────────────
// DELETE: Kullanıcının kendi yorumunu silmesi
router.delete("/:id", protect, deleteComment);

module.exports = router;