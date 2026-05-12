const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tarif adı zorunludur"],
      trim: true,
    },
    ingredients: {
      type: [String],
      required: [true, "Malzeme listesi zorunludur"],
      validate: {
        validator: function (val) {
          return val.length > 0;
        },
        message: "En az bir malzeme girilmelidir",
      },
    },
    instructions: {
      type: String,
      required: [true, "Hazırlanış açıklaması zorunludur"],
    },
    prepTime: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
