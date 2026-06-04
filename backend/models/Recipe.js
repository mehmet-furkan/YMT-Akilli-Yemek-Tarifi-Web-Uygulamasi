const mongoose = require("mongoose");

/**
 * Recipe (Tarif) Modeli
 * Uygulamanın ana içeriği. Arama ve öneri motoru bu modeli kullanır.
 */
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
        unit: {
          type: String,
          default: "", // örn: "gram", "adet", "yemek kaşığı"
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
    // Hazırlama süresi (dakika) — öneri motoru ve filtreleme için kritik
    cookTime: {
      type: Number,
      required: [true, "Pişirme süresi zorunludur"],
      min: [1, "Pişirme süresi en az 1 dakika olmalıdır"],
    },
    prepTime: {
      type: Number,
      default: 0, // Ön hazırlık süresi (opsiyonel)
    },
    servings: {
      type: Number,
      default: 4,
      min: [1, "Porsiyon sayısı en az 1 olmalıdır"],
    },
    // Kategori — filtreleme için zorunlu
    category: {
      type: String,
      required: [true, "Kategori zorunludur"],
      enum: {
        values: ["Kahvaltı", "Çorba", "Ana Yemek", "Salata", "Tatlı", "İçecek", "Atıştırmalık"],
        message: "Geçersiz kategori",
      },
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
    // Besin değerleri — porsiyon başına tahmini değerler (C.1 görevi: Zehra)
    // Tüm alanlar opsiyonel: enrichNutrition.js scripti backfill eder
    nutrition: {
      calories: { type: Number, min: 0 }, // kcal / porsiyon
      protein:  { type: Number, min: 0 }, // gram
      carbs:    { type: Number, min: 0 }, // gram
      fat:      { type: Number, min: 0 }, // gram
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

// --- İndeksler ---
// Metin araması: başlık ve açıklama üzerinde
RecipeSchema.index({ title: "text", description: "text" });
// Öneri motoru için malzeme araması
RecipeSchema.index({ "ingredients.name": 1 });
// Filtreleme için
RecipeSchema.index({ category: 1 });
RecipeSchema.index({ cookTime: 1 });
RecipeSchema.index({ difficulty: 1 });
RecipeSchema.index({ tags: 1 });

module.exports = mongoose.model("Recipe", RecipeSchema);
