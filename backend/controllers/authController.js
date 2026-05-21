const jwt = require("jsonwebtoken");
const User = require("../models/User");

// JWT Token oluşturma yardımcı fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Yeni kullanıcı kaydı
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Bu e-posta adresi zaten kayıtlı" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Kullanıcı girişi (İsmini authUser yaptık ki rotayla eşleşsin)
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Geçersiz e-posta veya şifre" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Geçersiz e-posta veya şifre" });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mevcut kullanıcı bilgilerini getir (/auth/me)
const getMe = async (req, res, next) => {
  try {
    // req.user.id, authMiddleware içinden gelecek
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Kullanıcı çıkışı (/auth/logout)
const logoutUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Başarıyla çıkış yapıldı",
    });
  } catch (error) {
    next(error);
  }
};

// BURASI ÇOK ÖNEMLİ: Yeni fonksiyonları da dışa aktarıyoruz
module.exports = { registerUser, authUser, getMe, logoutUser };