const mongoose = require("mongoose");

/**
 * Favorite (Favori) Modeli
 * Bir kullanıcının favori tariflerini tutar.
 * Aynı kullanıcı aynı tarifi iki kez ekleyemez (compound unique index).
 */
const FavoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Kullanıcı ID zorunludur"],
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: [true, "Tarif ID zorunludur"],
    },
  },
  {
    timestamps: true, // createdAt otomatik eklenir
  }
);

// --- Compound Unique Index ---
// Aynı kullanıcı aynı tarifi iki kez favoriye ekleyemez
FavoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", FavoriteSchema);
