const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Korumalı route'lar için JWT doğrulama middleware'i
const protect = async (req, res, next) => {
  let token;

  // Authorization header'dan Bearer token'ı al
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcıyı bul ve request nesnesine ekle (şifre hariç)
      req.user = await User.findById(decoded.id).select("-password");

      return next(); // İşlem başarılıysa sonraki adıma geç ve fonksiyonu bitir
    } catch (error) {
      console.error("Token doğrulama hatası:", error.message);
      // Hata durumunda işlemi bitir
      return res.status(401).json({
        success: false,
        message: "Yetkilendirme başarısız, geçersiz token",
      });
    }
  } else {
    // Token hiç yoksa işlemi bitir
    return res.status(401).json({
      success: false,
      message: "Yetkilendirme başarısız, token bulunamadı",
    });
  }
};

module.exports = { protect };