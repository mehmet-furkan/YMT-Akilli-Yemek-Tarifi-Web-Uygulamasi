const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// getMe ve logoutUser fonksiyonlarını da import ediyoruz
const { registerUser, authUser, getMe, logoutUser, googleAuth } = require("../controllers/authController");

// Auth middleware'i import ediyoruz (middleware dosyasında fonksiyonun adını 'protect' yaptıysan bu şekilde kalabilir, farklıysa burayı güncellemelisin)
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../lib/rateLimiters");

const registerValidation = [
  body("name").notEmpty().withMessage("İsim alanı boş bırakılamaz"),
  body("email").isEmail().withMessage("Geçerli bir e-posta adresi giriniz"),
  body("password").isLength({ min: 6 }).withMessage("Şifre en az 6 karakter olmalıdır"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

router.post("/register", registerValidation, registerUser);
router.post("/login", authUser);

// Google Sign-In — POST /api/auth/google
// Body: { credential: <Google ID token JWT> }
// Account linking: aynı email'le mevcut user'a otomatik bağlanır
router.post("/google", authLimiter, googleAuth);

// YENİ EKLENEN KORUMALI ROTALAR
router.get("/me", protect, getMe);
router.post("/logout", logoutUser);

module.exports = router;