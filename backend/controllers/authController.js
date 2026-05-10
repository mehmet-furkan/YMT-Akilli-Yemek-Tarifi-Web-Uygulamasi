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

// BURASI ÇOK ÖNEMLİ: İsimler rotadakiyle aynı oldu
module.exports = { registerUser, authUser };