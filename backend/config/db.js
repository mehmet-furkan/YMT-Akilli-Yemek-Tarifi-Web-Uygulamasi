const mongoose = require("mongoose");

/**
 * MongoDB bağlantısını kurar.
 * MONGO_URI .env dosyasından okunur.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 8+ için bu seçeneklere gerek yok, mongoose otomatik yönetir
    });
    console.log(`✅ MongoDB bağlandı: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB bağlantı hatası: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
