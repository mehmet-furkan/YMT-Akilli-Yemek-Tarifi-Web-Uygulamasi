const mongoose = require("mongoose");

// Docker'da MongoDB container'ı, backend başladığında henüz bağlantı kabul
// etmeye hazır olmayabilir (race condition). Bu yüzden tek seferde pes etmek
// yerine birkaç kez yeniden deniyoruz.
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000; // 5 saniye

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        // Mongo hazır değilse 5sn içinde fail et, sonsuza kadar asılı kalma.
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Bağlantısı Başarılı: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(
        `❌ MongoDB bağlantı denemesi ${attempt}/${MAX_RETRIES} başarısız: ${error.message}`
      );

      // Son deneme de başarısızsa artık uygulamayı kapat.
      if (attempt === MAX_RETRIES) {
        console.error(
          "❌ MongoDB'ye bağlanılamadı, deneme hakkı bitti. Sunucu kapatılıyor."
        );
        process.exit(1);
      }

      console.log(`⏳ ${RETRY_DELAY_MS / 1000} saniye sonra tekrar denenecek...`);
      await sleep(RETRY_DELAY_MS);
    }
  }
};

module.exports = connectDB;
