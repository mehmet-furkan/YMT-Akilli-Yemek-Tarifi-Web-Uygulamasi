const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Yeni Kullanıcı Kaydı
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Bu kullanıcı zaten var");
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" }),
    });
  }
};

// Kullanıcı Girişi
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" }),
    });
  } else {
    res.status(401);
    throw new Error("Geçersiz e-posta veya şifre");
  }
};

module.exports = { registerUser, loginUser };