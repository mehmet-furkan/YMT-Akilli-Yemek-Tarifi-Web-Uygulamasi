const express = require("express");
const router = express.Router();

const { deleteComment } = require("../controllers/comments.controller");
const { protect } = require("../middleware/authMiddleware");
const { commentLimiter } = require("../lib/rateLimiters");

// ── /api/comments/:id ─────────────────────────
// DELETE — Yorum sahibi kendi yorumunu siler (Private)
//
// Rate limit: 30 yorum-işlemi/saat/IP (silme dahil — abuse'a karşı)
router.delete("/:id", commentLimiter, protect, deleteComment);

module.exports = router;
