const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tarif adı zorunludur"],
      trim: true,
      maxlength: [100, "Tarif adı en fazla 100 karakter olabilir"],
    },
    description: {
      type: String,
      required: [true, "Tarif açıklaması zorunludur"],
      maxlength: [500, "Açıklama en fazla 500 karakter olabilir"],
    },
    ingredients: [
      {
        name: {
          type: String,
          required: [true, "Malzeme adı zorunludur"],
          trim: true,
        },
        amount: {
          type: String,
          required: [true, "Malzeme miktarı zorunludur"],
        },
        optional: {
          type: Boolean,
          default: false,
        },
      },
    ],
    instructions: {
      type: [String],
      required: [true, "Hazırlanış adımları zorunludur"],
      validate: {
        validator: function (val) {
          return val.length > 0;
        },
        message: "En az bir hazırlanış adımı girilmelidir",
      },
    },
    prepTime: {
      type: Number,
      required: [true, "Hazırlama süresi zorunludur"],
      min: [1, "Hazırlama süresi en az 1 dakika olmalıdır"],
    },
    difficulty: {
      type: String,
      enum: {
        values: ["Kolay", "Orta", "Zor"],
        message: "Zorluk seviyesi Kolay, Orta veya Zor olmalıdır",
      },
      default: "Orta",
    },
    tags: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// --- İndeksler: Malzeme bazlı hızlı arama için ---
RecipeSchema.index({ "ingredients.name": 1 });
RecipeSchema.index({ tags: 1 });
RecipeSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Recipe", RecipeSchema);
