/**
 * enrichNutrition.js
 *
 * Backfill script: mevcut 100 Türk tarifine porsiyon başına tahmini besin
 * değerlerini (calories, protein, carbs, fat) yazar.
 *
 * Değerler manuel küratörlük ile belirlenmiştir.
 * Her tarifte malzeme + porsiyon sayısı baz alınmıştır.
 * Tıbbi doğruluk hedeflenmez — UI gösterimi içindir.
 *
 * Run:  node scripts/enrichNutrition.js
 * Or:   npm run seed:nutrition
 *
 * Behavior:
 *  - nutrition alanı BOŞ olan tarifleri günceller (--force ile tümünü günceller)
 *  - Hatalı title'ı olanları konsola yazar, durdurmaz
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");

// ─── Besin değeri tablosu ───────────────────────────────────────────────────
// Her satır: [tarif başlığı, { calories, protein, carbs, fat }]
// Tüm değerler PORSİYON BAŞINADIR.
const NUTRITION_MAP = [
  // ── KAHVALTI (12) ──────────────────────────────────────────────────────────
  ["Menemen",                { calories: 210, protein: 13, carbs: 9,  fat: 14 }],
  ["Sucuklu Yumurta",        { calories: 320, protein: 18, carbs: 2,  fat: 26 }],
  ["Peynirli Omlet",         { calories: 240, protein: 17, carbs: 2,  fat: 18 }],
  ["Türk Kahvaltı Tabağı",   { calories: 380, protein: 18, carbs: 22, fat: 24 }],
  ["Akıtma",                 { calories: 190, protein: 6,  carbs: 28, fat: 6  }],
  ["Pişi",                   { calories: 280, protein: 5,  carbs: 42, fat: 10 }],
  ["Patatesli Yumurta",      { calories: 260, protein: 11, carbs: 22, fat: 15 }],
  ["Çılbır",                 { calories: 230, protein: 14, carbs: 8,  fat: 16 }],
  ["Mıhlama",                { calories: 350, protein: 14, carbs: 8,  fat: 28 }],
  ["Kahvaltılık Börek",      { calories: 310, protein: 11, carbs: 38, fat: 13 }],
  ["Yumurtalı Ekmek",        { calories: 220, protein: 9,  carbs: 26, fat: 9  }],
  ["Tahin Pekmezli Ekmek",   { calories: 270, protein: 6,  carbs: 38, fat: 11 }],

  // ── ÇORBA (15) ─────────────────────────────────────────────────────────────
  ["Mercimek Çorbası",       { calories: 180, protein: 10, carbs: 28, fat: 4  }],
  ["Ezogelin Çorbası",       { calories: 160, protein: 8,  carbs: 26, fat: 4  }],
  ["Yayla Çorbası",          { calories: 140, protein: 6,  carbs: 18, fat: 5  }],
  ["Tarhana Çorbası",        { calories: 130, protein: 5,  carbs: 20, fat: 4  }],
  ["Tavuklu Şehriye Çorbası",{ calories: 155, protein: 14, carbs: 14, fat: 4  }],
  ["Domates Çorbası",        { calories: 120, protein: 4,  carbs: 18, fat: 4  }],
  ["Brokoli Çorbası",        { calories: 110, protein: 4,  carbs: 14, fat: 5  }],
  ["Mantar Çorbası",         { calories: 145, protein: 5,  carbs: 12, fat: 8  }],
  ["Düğün Çorbası",          { calories: 200, protein: 12, carbs: 14, fat: 10 }],
  ["Yoğurtlu Köfte Çorbası (Analı Kızlı)", { calories: 240, protein: 14, carbs: 28, fat: 8  }],
  ["Tavuklu Sebze Çorbası",  { calories: 145, protein: 13, carbs: 14, fat: 4  }],
  ["Kremalı Kabak Çorbası",  { calories: 155, protein: 3,  carbs: 16, fat: 9  }],
  ["İşkembe Çorbası",        { calories: 170, protein: 14, carbs: 8,  fat: 9  }],
  ["Bahçıvan Çorbası",       { calories: 120, protein: 4,  carbs: 20, fat: 3  }],
  ["Patates Çorbası",        { calories: 135, protein: 4,  carbs: 22, fat: 4  }],

  // ── ANA YEMEK (35) ─────────────────────────────────────────────────────────
  ["Izgara Köfte",           { calories: 320, protein: 28, carbs: 6,  fat: 20 }],
  ["İskender",               { calories: 480, protein: 28, carbs: 34, fat: 24 }],
  ["Tavuk Şiş",              { calories: 280, protein: 35, carbs: 4,  fat: 13 }],
  ["Karnıyarık",             { calories: 360, protein: 18, carbs: 20, fat: 22 }],
  ["İmam Bayıldı",           { calories: 220, protein: 4,  carbs: 16, fat: 16 }],
  ["Etli Nohut",             { calories: 340, protein: 22, carbs: 30, fat: 14 }],
  ["Kuru Fasulye",           { calories: 290, protein: 16, carbs: 32, fat: 10 }],
  ["Tavuk Sote",             { calories: 270, protein: 32, carbs: 10, fat: 11 }],
  ["Hünkâr Beğendi",         { calories: 420, protein: 24, carbs: 22, fat: 26 }],
  ["Mantı",                  { calories: 380, protein: 18, carbs: 44, fat: 14 }],
  ["Lahmacun",               { calories: 310, protein: 16, carbs: 38, fat: 10 }],
  ["Pide",                   { calories: 420, protein: 20, carbs: 52, fat: 14 }],
  ["Kebap",                  { calories: 380, protein: 30, carbs: 8,  fat: 24 }],
  ["Etli Güveç",             { calories: 360, protein: 26, carbs: 18, fat: 20 }],
  ["Terbiyeli Köfte",        { calories: 300, protein: 22, carbs: 14, fat: 18 }],
  ["Tavuk Güveç",            { calories: 290, protein: 30, carbs: 14, fat: 14 }],
  ["Musakka",                { calories: 350, protein: 18, carbs: 18, fat: 22 }],
  ["Fırın Tavuk",            { calories: 310, protein: 36, carbs: 6,  fat: 16 }],
  ["Zeytinyağlı Enginar",    { calories: 180, protein: 4,  carbs: 14, fat: 12 }],
  ["Etli Yaprak Sarma",      { calories: 290, protein: 14, carbs: 28, fat: 14 }],
  ["Dolma (Biber)",          { calories: 260, protein: 10, carbs: 30, fat: 12 }],
  ["Alabalık Izgara",        { calories: 260, protein: 34, carbs: 0,  fat: 13 }],
  ["Hamsi Tava",             { calories: 300, protein: 28, carbs: 12, fat: 16 }],
  ["Midye Dolma",            { calories: 200, protein: 12, carbs: 24, fat: 6  }],
  ["Karides Güveç",          { calories: 240, protein: 22, carbs: 12, fat: 12 }],
  ["Etli Patates",           { calories: 320, protein: 18, carbs: 28, fat: 14 }],
  ["Kavurma",                { calories: 380, protein: 26, carbs: 2,  fat: 28 }],
  ["Ciğer Tava",             { calories: 270, protein: 26, carbs: 8,  fat: 16 }],
  ["Kadınbudu Köfte",        { calories: 330, protein: 20, carbs: 22, fat: 18 }],
  ["Sebzeli Mercimek",       { calories: 240, protein: 14, carbs: 36, fat: 5  }],
  ["Nohutlu Pilav",          { calories: 310, protein: 10, carbs: 52, fat: 8  }],
  ["Bulgurlu Sebze",         { calories: 220, protein: 8,  carbs: 40, fat: 4  }],
  ["Zeytinyağlı Kereviz",    { calories: 160, protein: 3,  carbs: 18, fat: 9  }],
  ["Zeytinyağlı Taze Fasulye",{ calories: 140, protein: 4, carbs: 14, fat: 8  }],
  ["Patlıcan Musakka",       { calories: 330, protein: 16, carbs: 20, fat: 20 }],

  // ── SALATA (10) ────────────────────────────────────────────────────────────
  ["Çoban Salatası",         { calories: 90,  protein: 2,  carbs: 10, fat: 5  }],
  ["Mevsim Salatası",        { calories: 80,  protein: 2,  carbs: 10, fat: 4  }],
  ["Kısır",                  { calories: 180, protein: 4,  carbs: 32, fat: 5  }],
  ["Piyaz",                  { calories: 190, protein: 8,  carbs: 24, fat: 7  }],
  ["Cacık",                  { calories: 80,  protein: 4,  carbs: 6,  fat: 4  }],
  ["Haydari",                { calories: 100, protein: 5,  carbs: 5,  fat: 7  }],
  ["Rus Salatası",           { calories: 220, protein: 4,  carbs: 18, fat: 14 }],
  ["Tabule",                 { calories: 140, protein: 4,  carbs: 22, fat: 5  }],
  ["Atom",                   { calories: 120, protein: 3,  carbs: 10, fat: 8  }],
  ["Gavurdağı Salatası",     { calories: 110, protein: 3,  carbs: 12, fat: 6  }],

  // ── TATLI (13) ─────────────────────────────────────────────────────────────
  ["Baklava",                { calories: 480, protein: 7,  carbs: 58, fat: 24 }],
  ["Sütlaç",                 { calories: 200, protein: 5,  carbs: 34, fat: 5  }],
  ["Kazandibi",              { calories: 220, protein: 5,  carbs: 36, fat: 6  }],
  ["Revani",                 { calories: 310, protein: 5,  carbs: 52, fat: 8  }],
  ["Kadayıf",                { calories: 420, protein: 6,  carbs: 56, fat: 18 }],
  ["Aşure",                  { calories: 250, protein: 6,  carbs: 52, fat: 3  }],
  ["Helva",                  { calories: 380, protein: 6,  carbs: 48, fat: 18 }],
  ["Tulumba",                { calories: 290, protein: 3,  carbs: 42, fat: 12 }],
  ["İrmik Helvası",          { calories: 340, protein: 5,  carbs: 52, fat: 12 }],
  ["Muhallebi",              { calories: 180, protein: 4,  carbs: 32, fat: 4  }],
  ["Lokum",                  { calories: 130, protein: 0,  carbs: 32, fat: 0  }],
  ["Keşkül",                 { calories: 200, protein: 5,  carbs: 30, fat: 7  }],
  ["Trileçe",                { calories: 310, protein: 6,  carbs: 42, fat: 12 }],

  // ── İÇECEK (5) ─────────────────────────────────────────────────────────────
  ["Türk Çayı",              { calories: 2,   protein: 0,  carbs: 0,  fat: 0  }],
  ["Ayran",                  { calories: 45,  protein: 3,  carbs: 4,  fat: 2  }],
  ["Şalgam Suyu",            { calories: 15,  protein: 0,  carbs: 3,  fat: 0  }],
  ["Boza",                   { calories: 120, protein: 3,  carbs: 26, fat: 1  }],
  ["Limonata",               { calories: 80,  protein: 0,  carbs: 20, fat: 0  }],

  // ── ATIŞTIRMALıK (10) ──────────────────────────────────────────────────────
  ["Sigara Böreği",          { calories: 200, protein: 7,  carbs: 22, fat: 10 }],
  ["Çiğ Köfte",              { calories: 160, protein: 5,  carbs: 30, fat: 3  }],
  ["Falafel",                { calories: 240, protein: 10, carbs: 28, fat: 11 }],
  ["Humus",                  { calories: 170, protein: 7,  carbs: 18, fat: 8  }],
  ["Patates Cipsi (Ev Yapımı)", { calories: 280, protein: 3, carbs: 34, fat: 15 }],
  ["Mısır Patlaması",        { calories: 120, protein: 3,  carbs: 22, fat: 3  }],
  ["Cevizli Tarçınlı Rulo",  { calories: 310, protein: 5,  carbs: 44, fat: 12 }],
  ["Peynirli Kraker",        { calories: 190, protein: 6,  carbs: 24, fat: 8  }],
  ["Tahinli Pide",           { calories: 260, protein: 6,  carbs: 40, fat: 9  }],
  ["Kumpir",                 { calories: 420, protein: 10, carbs: 54, fat: 18 }],
];

// ─── Yardımcı: başlığa göre eşleşme ───────────────────────────────────────
function buildNutritionLookup() {
  const lookup = new Map();
  for (const [title, nutrition] of NUTRITION_MAP) {
    lookup.set(title.toLowerCase().trim(), nutrition);
  }
  return lookup;
}

// ─── Ana fonksiyon ─────────────────────────────────────────────────────────
async function main() {
  const forceAll = process.argv.includes("--force");

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB bağlandı");

  const nutritionLookup = buildNutritionLookup();

  // force modunda tüm tarifleri al, normal modda nutrition alanı eksik olanları
  const filter = forceAll ? {} : { "nutrition.calories": { $exists: false } };
  const recipes = await Recipe.find(filter).select("title nutrition");

  console.log(`\n📋 ${recipes.length} tarif işlenecek (${forceAll ? "tümü --force" : "nutrition eksik olanlar"})\n`);

  let updated = 0;
  let skipped = 0;

  for (const recipe of recipes) {
    const key = recipe.title.toLowerCase().trim();
    const nutritionData = nutritionLookup.get(key);

    if (!nutritionData) {
      console.warn(`⚠️  Eşleşme bulunamadı → "${recipe.title}"`);
      skipped++;
      continue;
    }

    await Recipe.findByIdAndUpdate(recipe._id, {
      $set: { nutrition: nutritionData },
    });

    updated++;
    console.log(`   ✅ ${recipe.title} → ${nutritionData.calories} kcal | P:${nutritionData.protein}g | K:${nutritionData.carbs}g | Y:${nutritionData.fat}g`);
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`✅ Güncellendi : ${updated} tarif`);
  if (skipped > 0) {
    console.log(`⚠️  Atlandı    : ${skipped} tarif (NUTRITION_MAP'e ekle)`);
  }
  console.log(`─────────────────────────────────────────\n`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ enrichNutrition hatası:", err.message);
  process.exit(1);
});
