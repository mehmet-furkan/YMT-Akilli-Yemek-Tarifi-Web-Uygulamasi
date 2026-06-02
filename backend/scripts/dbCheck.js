require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Recipe = require("../models/Recipe");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const userCount = await User.countDocuments();
  const recipeCount = await Recipe.countDocuments();
  const users = await User.find().select("name email").lean();
  console.log("Users:", userCount);
  users.forEach((u) => console.log(" -", u.email, u._id.toString()));
  console.log("Recipes:", recipeCount);
  if (recipeCount > 0) {
    const sample = await Recipe.findOne().lean();
    console.log("Sample recipe fields:", Object.keys(sample));
  }
  await mongoose.disconnect();
})();
