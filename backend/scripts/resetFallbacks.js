/**
 * One-off: reset imageUrl to "" for recipes that currently use the Unsplash
 * category-fallback URL, so a subsequent `npm run images:backfill` will
 * re-process only those (instead of forcing all 100).
 *
 * Safe to run multiple times. Does nothing if there are no fallback URLs.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await Recipe.updateMany(
    { imageUrl: { $regex: "^https://images.unsplash.com" } },
    { $set: { imageUrl: "" } },
  );
  console.log(`Reset ${result.modifiedCount} fallback imageUrl(s) to empty.`);
  await mongoose.disconnect();
})();
