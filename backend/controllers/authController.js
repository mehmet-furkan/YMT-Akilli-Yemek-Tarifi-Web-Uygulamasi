const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

// Lazy initialization — env yüklendikten sonra constructor çağrılır
let googleClient;
const getGoogleClient = () => {
  if (!googleClient) {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error("GOOGLE_CLIENT_ID ortam değişkeni tanımlı değil");
    }
    googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  return googleClient;
};

// JWT Token oluşturma yardımcı fonksiyonu
const generateToken = (id, rememberMe = false) => {
  const expiresIn = rememberMe ? "30d" : (process.env.JWT_EXPIRE || "1d");
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

// @desc    Yeni kullanıcı kaydı
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Bu e-posta adresi zaten kayıtlı" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Kullanıcı girişi (İsmini authUser yaptık ki rotayla eşleşsin)
const authUser = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Geçersiz e-posta veya şifre" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Geçersiz e-posta veya şifre" });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id, rememberMe),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mevcut kullanıcı bilgilerini getir (/auth/me)
const getMe = async (req, res, next) => {
  try {
    // req.user.id, authMiddleware içinden gelecek
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Kullanıcı çıkışı (/auth/logout)
const logoutUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Başarıyla çıkış yapıldı",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Google ID token ile giriş / kayıt
// @route   POST /api/auth/google
// @access  Public
// Body: { credential: <Google ID token JWT> }
//
// Akış:
//   1. Token'ı google-auth-library ile doğrula (aud + iss + signature otomatik)
//   2. email_verified zorunlu — Google email'i doğrulamamışsa reddet
//   3. Email ile mevcut user'ı bul:
//      - varsa: googleId ata (account linking) ve giriş yap
//      - yoksa: yeni user oluştur (password olmadan)
//   4. Mevcut JWT formatında token döndür
const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res
        .status(400)
        .json({ success: false, message: "Google kimlik bilgisi eksik" });
    }

    // 1. Token verify — aud (client ID) ve iss (Google) otomatik kontrol edilir
    const ticket = await getGoogleClient().verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // 2. email_verified kontrolü — güvenlik: Google email'i doğrulamadıysa reddet
    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(401).json({
        success: false,
        message: "Google hesabınızın email'i doğrulanmamış",
      });
    }

    const { email, name, sub: googleId } = payload;
    const lowerEmail = email.toLowerCase();

    // 3. Email ile user'ı bul
    let user = await User.findOne({ email: lowerEmail }).select("+googleId");

    if (user) {
      // Mevcut user — googleId yoksa link et
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Yeni user oluştur — password olmadan
      user = await User.create({
        name: name || lowerEmail.split("@")[0],
        email: lowerEmail,
        googleId,
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id, true), // Google login → 30 gün remember
      },
    });
  } catch (error) {
    // google-auth-library invalid token hatasını fırlatır
    if (error.message && error.message.includes("Token")) {
      return res
        .status(401)
        .json({ success: false, message: "Google kimlik bilgisi geçersiz" });
    }
    next(error);
  }
};

// BURASI ÇOK ÖNEMLİ: Yeni fonksiyonları da dışa aktarıyoruz
module.exports = { registerUser, authUser, getMe, logoutUser, googleAuth };