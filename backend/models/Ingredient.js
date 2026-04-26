const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Malzeme adı zorunludur"],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Kategori zorunludur"],
      enum: ["Sebze", "Meyve", "Et", "Süt Ürünü", "Baharat", "Baklagil", "Tahıl", "Yağ", "Diğer"],
      default: "Diğer",
    },
  },
  {
    timestamps: true,
  }
);

// --- İndeks: Malzeme adı üzerinde hızlı arama ---
IngredientSchema.index({ name: "text" });

module.exports = mongoose.model("Ingredient", IngredientSchema);
