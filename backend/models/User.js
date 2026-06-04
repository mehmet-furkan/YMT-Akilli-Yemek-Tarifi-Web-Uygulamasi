const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lütfen adınızı giriniz"],
      trim: true,
      maxlength: [50, "Ad en fazla 50 karakter olabilir"],
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // Existing users might not have a username, so sparse index allows nulls
      trim: true,
      lowercase: true,
    },
    profilePhoto: {
      type: String,
      default: "", // Varsayılan avatar fallback'i UI'da yapılacak
    },
    coverPhoto: {
      type: String,
      default: "", // Varsayılan kapak fotoğrafı fallback'i UI'da yapılacak
    },
    bio: {
      type: String,
      maxlength: [160, "Biyografi en fazla 160 karakter olabilir"],
    },
    city: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Kadın", "Erkek", "Belirtmek İstemiyorum"],
    },
    birthDate: {
      type: Date,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    recipesCount: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      required: [true, "Lütfen e-posta adresinizi giriniz"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Lütfen geçerli bir e-posta adresi giriniz",
      ],
    },
    password: {
      type: String,
      required: [true, "Lütfen şifrenizi giriniz"],
      minlength: [6, "Şifre en az 6 karakter olmalıdır"],
      select: false, // Sorgularda şifre varsayılan olarak döndürülmez
    },
    preferences: {
      diet: {
        type: [String],
        enum: [
          "Vegan",
          "Vejetaryen",
          "Vejeteryan",
          "Keto",
          "Glutensiz",
          "Laktozsuz",
          "Helal",
          "Düşük Karbonhidrat",
        ],
        default: [],
      },
      allergies: {
        type: [String],
        default: [],
      },
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    savedRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  {
    timestamps: true, // createdAt ve updatedAt otomatik eklenir
  }
);

// --- Middleware: Kayıt öncesi şifreyi hashle ---
UserSchema.pre("save", async function () {
  // Şifre değişmediyse hashleme
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// --- Metod: Girilen şifre ile hashlenmiş şifreyi karşılaştır ---
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
