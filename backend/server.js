const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet"); // Güvenlik başlıkları
const mongoSanitize = require("express-mongo-sanitize"); // NoSQL Injection koruması
const xss = require("xss-clean"); // XSS saldırı koruması
const hpp = require("hpp"); // HTTP Parameter Pollution koruması
const rateLimit = require("express-rate-limit"); // İstek sınırlama

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Route dosyaları
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");

// .env dosyasını yükle
dotenv.config();

// MongoDB bağlantısını başlat
connectDB();

const app = express();

// --- 1. GÖREV: GÜVENLİK MIDDLEWARE'LERİ ---

// 1. Güvenlik başlıklarını ayarla (Helmet)
app.use(helmet());

// 2. NoSQL Injection koruması (Veritabanı güvenliği)
app.use(mongoSanitize());

// 3. XSS (Cross-Site Scripting) koruması
app.use(xss());

// 4. HTTP Parametre Kirliliği koruması
app.use(hpp());

// 5. Rate Limiting (Kötü niyetli istekleri sınırlama)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 dakika
  max: 100, // Her IP için maksimum 100 istek
  message: "Çok fazla istek gönderdiniz, lütfen 10 dakika sonra tekrar deneyin."
});
app.use("/api/", limiter);


// --- Temel Middleware'ler ---

// JSON body parser
app.use(express.json({ limit: '10kb' })); // Gövde boyutunu sınırlayarak güvenliği artırdık

// URL-encoded body parser
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS ayarları
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- API Route'ları ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);

// Kök endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🍳 Night Code Kitchen API - Aktif ve Güvenli",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      recipes: "/api/recipes",
    },
  });
});

// --- Hata Yönetimi Middleware'leri ---
app.use(notFound);
app.use(errorHandler);

// --- Sunucuyu Başlat ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server çalışıyor: http://localhost:${PORT}`);
  console.log(`🛡️ Güvenlik katmanları aktif edildi.`);
  console.log(`📦 Ortam: ${process.env.NODE_ENV || "development"}\n`);
});