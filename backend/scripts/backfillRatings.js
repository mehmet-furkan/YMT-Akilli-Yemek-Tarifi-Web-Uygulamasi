/**
 * backfillRatings.js
 *
 * One-shot: mevcut Comment'lerden tüm Recipe'lerin averageRating ve
 * ratingsCount alanlarını hesaplayıp doldurur.
 *
 * Recipe modeline averageRating/ratingsCount cache alanları sonradan
 * eklendiği için, deploy sırasında bir kez çalıştırılması gerekir.
 *
 * Run:  node scripts/backfillRatings.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");
const Comment = require("../models/Comment");
const { recomputeRecipeRating } = require("../services/rating.service");

(async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI tanımlı değil");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB bağlandı");

  // Yorumu olan tarifleri tek aggregate ile bul (boş tarifler default 0/0 kalır)
  const recipeIds = await Comment.distinct("recipeId");
  console.log(`${recipeIds.length} tarif için rating hesaplanacak`);

  let updated = 0;
  for (const id of recipeIds) {
    const { averageRating, ratingsCount } = await recomputeRecipeRating(id);
    console.log(`  ${id}: avg=${averageRating} count=${ratingsCount}`);
    updated++;
  }

  // Hiç yorumu olmayan tarifleri de explicit 0/0'a çek (eski veri tutarlılığı)
  const result = await Recipe.updateMany(
    { _id: { $nin: recipeIds } },
    { $set: { averageRating: 0, ratingsCount: 0 } }
  );
  console.log(`${result.modifiedCount} tarif default değerlere çekildi`);

  console.log(`Toplam ${updated} tarif güncellendi`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
