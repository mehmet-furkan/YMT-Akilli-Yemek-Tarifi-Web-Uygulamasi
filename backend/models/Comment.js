const mongoose = require("mongoose");

/**
 * Comment (Yorum ve Puanlama) Modeli
 */
const CommentSchema = new mongoose.Schema(
  {
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: [true, "Tarif ID'si zorunludur"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Kullanıcı ID'si zorunludur"],
    },
    rating: {
      type: Number,
      required: [true, "Puan alanı zorunludur"],
      min: [1, "Puan en az 1 olabilir"],
      max: [5, "Puan en fazla 5 olabilir"],
    },
    text: {
      type: String,
      maxlength: [500, "Yorum en fazla 500 karakter olabilir"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound Index: Bir kullanıcı bir tarife sadece bir kez yorum yapabilir.
CommentSchema.index({ recipeId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Comment", CommentSchema);