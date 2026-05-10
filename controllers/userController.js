const User = require("../models/User");

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({ _id: user._id, name: user.name, email: user.email });
  } else {
    res.status(404);
    throw new Error("Kullanıcı bulunamadı");
  }
};

module.exports = { getUserProfile };