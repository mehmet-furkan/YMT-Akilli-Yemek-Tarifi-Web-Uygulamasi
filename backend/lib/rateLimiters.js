const rateLimit = require("express-rate-limit");

/**
 * Rate limiter'ları tek bir yerde topluyoruz ki birden fazla route dosyasından
 * tutarlı şekilde uygulanabilsin (örn. POST /api/recipes/:id/comments ve
 * DELETE /api/comments/:id için aynı yorum limiti).
 */

/**
 * Comment endpoint'leri için: bir IP saatte max 30 yorum
 * Görsel A.2'deki spec.
 */
const commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Çok fazla yorum, biraz dinlenin.",
  },
});

/**
 * Auth endpoint'leri için: bir IP 15 dakikada max 20 deneme.
 * Login, register ve OAuth (Google) için ortak kullanılır — brute force koruması.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Çok fazla deneme. Lütfen 15 dakika sonra tekrar deneyin.",
  },
});

module.exports = {
  commentLimiter,
  authLimiter,
};
