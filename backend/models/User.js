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
        enum: ["Vegan", "Vejetaryen", "Keto", "Glutensiz", "Laktozsuz"],
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
  },
  {
    timestamps: true, // createdAt ve updatedAt otomatik eklenir
  }
);

// --- Middleware: Kayıt öncesi şifreyi hashle ---
UserSchema.pre("save", async function (next) {
  // Şifre değişmediyse hashleme
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Metod: Girilen şifre ile hashlenmiş şifreyi karşılaştır ---
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
