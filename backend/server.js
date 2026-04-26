const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
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

// --- Temel Middleware'ler ---

// JSON body parser
app.use(express.json());

// URL-encoded body parser
app.use(express.urlencoded({ extended: true }));

// CORS ayarları (React frontend ile iletişim için)
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

// Kök endpoint - API durum kontrolü
app.get("/", (req, res) => {
  res.json({
    message: "🍳 Night Code Kitchen API - Aktif",
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
  console.log(`📦 Ortam: ${process.env.NODE_ENV || "development"}\n`);
});
