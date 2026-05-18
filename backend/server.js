const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Yapılandırma
dotenv.config();
connectDB();

const app = express();

// --- 🛡️ GÜVENLİK KATMANLARI (Modern Standartlar) ---

// 1. Helmet: Tarayıcı güvenliğini sağlar, XSS saldırılarına karşı kalkan olur.
app.use(helmet());

// 2. HPP: HTTP Parametre Kirliliğini engeller.
app.use(hpp());

// 3. Rate Limiting: Botları ve kaba kuvvet saldırılarını engeller.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // IP başına limit
  message: { success: false, message: "Çok fazla istek, lütfen dinlenin." }
});
app.use("/api/", limiter);

// 4. Veri Sınırlama: Büyük boyutlu saldırı paketlerini (DoS) engeller.
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. CORS: Sadece güvenli kökenlere izin verir.
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// --- 🚀 ROTALAR ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/recipes", require("./routes/recipeRoutes"));

// --- 📄 SWAGGER UI ---
require("./config/swagger")(app);

app.get("/", (req, res) => res.json({ status: "success", message: "Night Code Kitchen API Güvende!" }));

// --- 💚 HEALTH CHECK ---
app.get("/api/health", (req, res) => res.json({ status: "ok", message: "Night Code Kitchen API çalışıyor! 🚀" }));

// Hata Yönetimi
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n🚀 Sunucu ${PORT} portunda aktif.`);
  console.log(`🛡️ Güvenlik Modernize Edildi: Helmet, HPP ve Rate Limit devrede.\n`);
});