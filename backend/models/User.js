const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User (Kullanıcı) Modeli
 * Kimlik doğrulama ve kişiselleştirme için temel model.
 */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "İsim zorunludur"],
      trim: true,
      maxlength: [50, "İsim en fazla 50 karakter olabilir"],
    },
    email: {
      type: String,
      required: [true, "E-posta zorunludur"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Geçerli bir e-posta adresi giriniz"],
    },
    password: {
      type: String,
      required: [true, "Şifre zorunludur"],
      minlength: [6, "Şifre en az 6 karakter olmalıdır"],
      select: false, // Varsayılan sorgularda şifre gönderilmez
    },
    // Diyet tercihleri — öneri motoru için kullanılacak
    dietaryPreferences: {
      type: [String],
      enum: {
        values: ["Vejeteryan", "Vegan", "Glutensiz", "Laktozsuz", "Helal", "Düşük Karbonhidrat"],
        message: "Geçersiz diyet tercihi",
      },
      default: [],
    },
    // Alerjiler — öneri motorunda hariç tutma için
    allergies: {
      type: [String],
      default: [],
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// --- Pre-save Hook: Şifreyi kaydetmeden önce hashle ---
UserSchema.pre("save", async function (next) {
  // Şifre değişmediyse atla
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Method: Şifre karşılaştırma ---
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
