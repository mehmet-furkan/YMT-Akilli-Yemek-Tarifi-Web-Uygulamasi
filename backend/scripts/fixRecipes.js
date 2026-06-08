/**
 * fixRecipes.js
 *
 * Mevcut tariflere targeted düzeltmeler uygular. seedRecipes.js'in aksine bu
 * script tarifleri SİLMEZ — başlığa göre bulup belirli alanları güncelliyor.
 * Idempotent: yeniden koşmak değer değiştirmez (aynı içeriği yeniden yazar).
 *
 * scripts/auditRecipes.js çıktısında "FIRIN: derece belirtilmemiş" veya
 * "FIRIN: süre belirtilmemiş" hatası olan tarifler ele alındı. Kaynak:
 * yemek.com (https://yemek.com).
 *
 * Run:
 *   node scripts/fixRecipes.js              # gerçek update
 *   node scripts/fixRecipes.js --dry-run    # ne değişeceğini göster, yazma
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");

const DRY_RUN = process.argv.includes("--dry-run");

/**
 * Her fix: { title, updates } veya { title, replaceInstructions: [...] }
 * - `updates`: $set ile geçen kısmi field güncellemeleri
 * - `replaceInstructions`: tüm instructions array'ini değiştirir
 *   (cookTime/prepTime gibi field'lar updates üzerinden de gönderilebilir)
 */
const FIXES = [
  // ── #50 Hünkar Beğendi — patlıcan fırınlama 200°C, 20 dk
  // Kaynak: https://yemek.com (Hünkar Beğendi tarifi)
  {
    title: "Hünkar Beğendi",
    replaceInstructions: [
      "Eti soğanla kavurun, salça ve su ekleyip 1 saat pişirin.",
      "Patlıcanları çatalla deldikten sonra 200°C önceden ısıtılmış fırında 20 dakika közleyin (veya doğrudan ocak alevinde).",
      "Patlıcanları soğutup kabuğunu soyun ve ezerek püre yapın.",
      "Tereyağında unu kavurun, patlıcanı ekleyip karıştırın.",
      "Sıcak sütü yavaşça ekleyin, koyulaşınca peynir ve baharatı katın.",
      "Beğendi sosunu tabağa yayıp üstüne yahniyi koyun ve sıcak servis edin.",
    ],
  },

  // ── #66 Patlıcan Salatası — patlıcan közleme 200°C 40 dk
  // Kaynak: https://yemek.com/tarif/patlican-salatasi/
  {
    title: "Patlıcan Salatası",
    replaceInstructions: [
      "Patlıcanları çatalla delip 200°C önceden ısıtılmış fırında 35-40 dakika közleyin (veya ocak ızgarasında doğrudan alevde).",
      "Patlıcanları soğutup kabuğunu soyun ve püre haline getirin.",
      "Yoğurt, ezilmiş sarımsak, limon suyu ve tuzu ekleyin.",
      "Üstüne zeytinyağı gezdirip maydanoz serpin, soğuk servis edin.",
    ],
  },

  // ── #73 Sütlaç — fırın 200°C 12-15 dk
  // Kaynak: https://yemek.com/tarif/firin-sutlac/
  {
    title: "Sütlaç",
    replaceInstructions: [
      "Pirinci suda yumuşayana kadar 20 dakika haşlayın.",
      "Sütü ekleyip kaynamaya bırakın, ara sıra karıştırın.",
      "Şekeri katıp eritin, 10 dakika daha pişirin.",
      "Az suyla açılmış nişastayı yavaşça karıştırarak ekleyin, kıvam alana kadar pişirin.",
      "Vanilyayı ekleyip kâselere paylaştırın.",
      "Önceden ısıtılmış 200°C fırında üzeri pembeleşene kadar 12-15 dakika fırınlayın.",
      "Soğuduktan sonra üzerine tarçın serpip servis edin.",
    ],
    updates: { cookTime: 45 }, // 20 dk haşlama + 10 dk şeker + kıvam + 15 dk fırın
  },

  // ── #2 İskender — yemek.com'a göre içerik zenginleştirildi
  // Mevcut tarif sadece 5 malzemeydi (et, pide, yoğurt, domates sosu, tereyağı)
  // — domates sosu ve et marinasyonu için detay eksikti.
  // Kaynak: https://yemek.com/tarif/iskender/
  {
    title: "İskender",
    replaceInstructions: [
      "Antrikotu ince dilimleyip süt, ezilmiş sarımsak, salça, kekik, kırmızı biber ve tuzla harmanlayıp 1 saat marine edin.",
      "Tırnak pideyi küp doğrayıp kuru tavada 1-2 dakika ısıtın, derin tabağa dizin.",
      "Tereyağını eritip eti 6-8 dakika yüksek ateşte mühürleyin ve pidelerin üstüne koyun.",
      "Domates sosu için: tereyağında salça ve kırmızı biberi kavurun, sıcak su ve tuz ekleyip 3 dakika kaynatın.",
      "Yoğurdu pidelerin yanına yerleştirin, domates sosunu etin üstüne gezdirin.",
      "Kalan tereyağını cızırdayana kadar ısıtıp tabağın üstüne dökerek sıcak servis edin.",
    ],
    updates: {
      prepTime: 65, // 60 dk marinasyon + 5 dk hazırlık
      cookTime: 15,
      servings: 2,
      ingredients: [
        // Et için
        { name: "antrikot (ince dilimlenmiş döner)", amount: "400", unit: "gram" },
        { name: "süt", amount: "0.5", unit: "su bardağı" },
        { name: "sarımsak", amount: "2", unit: "diş" },
        { name: "salça", amount: "1", unit: "tatlı kaşığı" },
        { name: "kekik", amount: "1", unit: "tatlı kaşığı" },
        { name: "kırmızı toz biber", amount: "1", unit: "tatlı kaşığı" },
        // Sos için
        { name: "domates salçası", amount: "1", unit: "yemek kaşığı" },
        { name: "kırmızı toz biber", amount: "1", unit: "tatlı kaşığı" },
        { name: "sıcak su", amount: "1", unit: "su bardağı" },
        // Servis için
        { name: "tırnak pide", amount: "2", unit: "adet" },
        { name: "süzme yoğurt", amount: "1", unit: "su bardağı" },
        { name: "tereyağı", amount: "80", unit: "gram" },
        { name: "tuz", amount: "1", unit: "tatlı kaşığı" },
        { name: "karabiber", amount: "1", unit: "çay kaşığı" },
      ],
    },
  },
];

(async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI tanımlı değil");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB bağlandı ${DRY_RUN ? "(DRY-RUN modu)" : ""}\n`);

  let updated = 0;
  let notFound = 0;

  for (const fix of FIXES) {
    const recipe = await Recipe.findOne({ title: fix.title });
    if (!recipe) {
      console.log(`⚠️  "${fix.title}" bulunamadı, atlandı`);
      notFound++;
      continue;
    }

    const patch = {};
    if (fix.replaceInstructions) patch.instructions = fix.replaceInstructions;
    if (fix.updates) Object.assign(patch, fix.updates);

    console.log(`📝 ${fix.title}`);
    Object.entries(patch).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        console.log(`    ${key}: ${value.length} adım`);
      } else {
        console.log(`    ${key}: ${value}`);
      }
    });

    if (!DRY_RUN) {
      await Recipe.updateOne({ _id: recipe._id }, { $set: patch });
    }
    updated++;
    console.log();
  }

  console.log(
    `Toplam: ${updated} tarif ${DRY_RUN ? "güncellenecek" : "güncellendi"}, ${notFound} bulunamadı`
  );

  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
