const Comment = require("../models/Comment");
const asyncHandler = require("../lib/asyncHandler");

// ─────────────────────────────────────────────
// GET /api/recipes/:id/comments
// Bir tarifin tüm yorumlarını listele (Public).
// userId populate edilerek yalnızca "name" alanı dönderilir.
// ─────────────────────────────────────────────
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ recipeId: req.params.id })
    .populate("userId", "name")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: comments });
});

// ─────────────────────────────────────────────
// POST /api/recipes/:id/comments
// Yeni yorum oluştur (Private + Zod validate + commentLimiter).
// Aynı kullanıcı aynı tarife birden fazla yorum atamaz (compound unique index).
// ─────────────────────────────────────────────
const createComment = asyncHandler(async (req, res) => {
  // req.body, validate middleware'i tarafından zaten parse edilmiş ve XSS
  // temizlenmiştir. Burada yeniden parse etmeye gerek yok.
  const { rating, text } = req.body;

  try {
    const comment = await Comment.create({
      recipeId: req.params.id,
      userId: req.user._id,
      rating,
      text,
    });
    await comment.populate("userId", "name");
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    // Compound unique index — aynı kullanıcı aynı tarife tek yorum
    if (err.code === 11000) {
      res.status(400);
      throw new Error("Bu tarife zaten yorum yaptınız");
    }
    throw err;
  }
});

// ─────────────────────────────────────────────
// DELETE /api/comments/:id
// Yorum sahibi kendi yorumunu silebilir (Private + owner check).
// ─────────────────────────────────────────────
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error("Yorum bulunamadı");
  }

  if (comment.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Bu yorumu silme yetkiniz yok");
  }

  await comment.deleteOne();

  // OpenAPI spec: 204 No Content (favorites delete ile aynı pattern)
  res.status(204).send();
});

module.exports = {
  getComments,
  createComment,
  deleteComment,
};
