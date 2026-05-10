const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { registerUser, authUser } = require("../controllers/authController");

// --- VALIDATION MIDDLEWARE ---
// Bu kısım Hafta 4 (OWASP) ve Hafta 6 (Güvenlik Güncelleme) görevlerini kapsar.
const registerValidation = [
  body("name").notEmpty().withMessage("İsim alanı boş bırakılamaz"),
  body("email").isEmail().withMessage("Geçerli bir e-posta adresi giriniz"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Şifre en az 6 karakter olmalıdır"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// --- ROUTES ---

// Kayıt Olma Rotası (Validation eklendi)
router.post("/register", registerValidation, registerUser);

// Giriş Yapma Rotası
router.post("/login", authUser);

module.exports = router;