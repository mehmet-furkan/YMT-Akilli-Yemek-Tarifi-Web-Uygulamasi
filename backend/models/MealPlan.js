const mongoose = require("mongoose");

/**
 * MealPlan (Yemek Planı) Modeli
 * Kullanıcının belirli bir güne ait öğün planını tutar.
 * Örnek: "Pazartesi kahvaltısında menemen, öğlende mercimek çorbası"
 */
const MealSchema = new mongoose.Schema(
  {
    mealType: {
      type: String,
      required: [true, "Öğün türü zorunludur"],
      enum: {
        values: ["Kahvaltı", "Öğle", "Akşam", "Ara Öğün"],
        message: "Öğün türü: Kahvaltı, Öğle, Akşam veya Ara Öğün olmalıdır",
      },
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: [true, "Tarif ID zorunludur"],
    },
  },
  { _id: false } // Alt doküman, kendi ID'sine ihtiyaç yok
);

const MealPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Kullanıcı ID zorunludur"],
    },
    date: {
      type: Date,
      required: [true, "Tarih zorunludur"],
    },
    meals: {
      type: [MealSchema],
      validate: {
        validator: function (val) {
          return val.length > 0;
        },
        message: "En az bir öğün girilmelidir",
      },
    },
    notes: {
      type: String,
      maxlength: [300, "Not en fazla 300 karakter olabilir"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// --- İndeks: Kullanıcının tarihlerine göre hızlı arama ---
MealPlanSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("MealPlan", MealPlanSchema);
