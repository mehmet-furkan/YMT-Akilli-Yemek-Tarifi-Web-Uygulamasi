const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Recipe = require("../models/Recipe");

/**
 * rating.service.js
 *
 * Comment koleksiyonu rating'lerin gerçek kaynağıdır (compound unique index
 * sayesinde her user-recipe için tek puan garanti). Recipe modelindeki
 * averageRating / ratingsCount alanları ise liste sayfalarının ek aggregate
 * çağrısı yapmamasi için tutulan cache'tir.
 *
 * Comment create/delete sonrası bu cache'i güncel tutmak için
 * recomputeRecipeRating çağrılır.
 */

/**
 * Bir tarifin averageRating ve ratingsCount alanlarını Comment koleksiyonundan
 * yeniden hesaplayıp Recipe dokümanına yazar.
 *
 * @param {string|mongoose.Types.ObjectId} recipeId
 * @returns {Promise<{averageRating: number, ratingsCount: number}>}
 */
const recomputeRecipeRating = async (recipeId) => {
  const objectId = new mongoose.Types.ObjectId(recipeId);

  const [stats] = await Comment.aggregate([
    { $match: { recipeId: objectId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        ratingsCount: { $sum: 1 },
      },
    },
  ]);

  // Hiç yorum yoksa default 0
  const averageRating = stats ? Math.round(stats.averageRating * 10) / 10 : 0;
  const ratingsCount = stats ? stats.ratingsCount : 0;

  await Recipe.updateOne(
    { _id: objectId },
    { $set: { averageRating, ratingsCount } }
  );

  return { averageRating, ratingsCount };
};

module.exports = { recomputeRecipeRating };
