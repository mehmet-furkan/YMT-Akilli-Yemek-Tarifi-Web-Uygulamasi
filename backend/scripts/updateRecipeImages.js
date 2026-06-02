/**
 * Backfill imageUrl for every Recipe with an empty imageUrl.
 *
 * Strategy:
 *  1. Try TheMealDB search API (free, no key) with a curated Turkish->TheMealDB
 *     name map. If a meal is found, use its strMealThumb CDN URL.
 *  2. Otherwise fall back to a stable category-default Unsplash photo.
 *
 * Recipes whose imageUrl is already non-empty are skipped, so re-runs are
 * idempotent and the script is safe to run after manually editing some
 * imageUrls in MongoDB Compass.
 *
 * Run:  node scripts/updateRecipeImages.js
 * Or:   npm run images:backfill
 *
 * Flags:
 *   --force      ignore the "skip if imageUrl already set" rule
 *   --dry-run    print what would change without writing to DB
 */
require("dotenv").config();
const mongoose = require("mongoose");
const https = require("https");
const Recipe = require("../models/Recipe");

const FORCE = process.argv.includes("--force");
const DRY_RUN = process.argv.includes("--dry-run");

// --- Curated TheMealDB search keywords for our Turkish recipe titles ---
// Only recipes that are likely to exist in TheMealDB are listed. Anything not
// in this map skips the API call and goes straight to category fallback.
const themealdbKeywords = {
  "Menemen": "menemen",
  "Mantı": "manti",
  "Baklava": "baklava",
  "Lahmacun": "lahmacun",
  "İmam Bayıldı": "imam bayildi",
  "Künefe": "kunefe",
  "Mercimek Çorbası": "lentil soup",
  "Sütlaç": "sutlac",
  "Karnıyarık": "karniyarik",
  "Türk Kahvesi": "turkish coffee",
  "Tavuk Şiş": "shish",
  "Etli Yaprak Sarma": "dolma",
  "Zeytinyağlı Yaprak Sarma": "dolma",
  "Pide (Kıymalı Pide)": "pide",
  "Kıymalı Pide": "pide",
  "Tas Kebabı": "kebab",
  "Hünkar Beğendi": "hunkar begendi",
  "Şekerpare": "sekerpare",
  "Revani": "revani",
  "Kadayıf Cevizli": "kadayif",
  "Lokma": "lokma",
};

// --- Category fallback images (stable Unsplash CDN, free Unsplash License) ---
const categoryFallback = {
  "Kahvaltı":      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1080&auto=format",
  "Çorba":         "https://images.unsplash.com/photo-1547592180-85f173990554?w=1080&auto=format",
  "Ana Yemek":     "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1080&auto=format",
  "Salata":        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1080&auto=format",
  "Tatlı":         "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1080&auto=format",
  "İçecek":        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=1080&auto=format",
  "Atıştırmalık":  "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1080&auto=format",
};

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

async function findThemealdbImage(title) {
  const keyword = themealdbKeywords[title];
  if (!keyword) return null;
  try {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(keyword)}`;
    const data = await fetchJson(url);
    if (data && Array.isArray(data.meals) && data.meals.length > 0) {
      return data.meals[0].strMealThumb || null;
    }
  } catch (err) {
    console.warn(`  ! TheMealDB lookup failed for "${title}": ${err.message}`);
  }
  return null;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`✓ Connected to MongoDB at ${mongoose.connection.host}`);
  if (DRY_RUN) console.log("⚠ DRY RUN — no writes will be made");
  if (FORCE) console.log("⚠ FORCE — existing imageUrl values will be overwritten");

  const filter = FORCE ? {} : { $or: [{ imageUrl: "" }, { imageUrl: { $exists: false } }] };
  const targets = await Recipe.find(filter).select("title category imageUrl").lean();
  console.log(`Found ${targets.length} recipe(s) needing an image\n`);

  let themealdbHits = 0;
  let categoryFallbacks = 0;
  let skipped = 0;

  for (const recipe of targets) {
    let url = await findThemealdbImage(recipe.title);
    let source = "themealdb";
    if (!url) {
      url = categoryFallback[recipe.category];
      source = "fallback";
    }
    if (!url) {
      console.log(`  ? ${recipe.title} (${recipe.category}) — no image found, skipping`);
      skipped++;
      continue;
    }

    if (source === "themealdb") themealdbHits++;
    else categoryFallbacks++;

    const marker = source === "themealdb" ? "✓" : "·";
    console.log(`  ${marker} [${source}] ${recipe.title}`);
    if (!DRY_RUN) {
      await Recipe.updateOne({ _id: recipe._id }, { $set: { imageUrl: url } });
    }
  }

  console.log("\n--- Summary ---");
  console.log(`  TheMealDB hits:    ${themealdbHits}`);
  console.log(`  Category fallback: ${categoryFallbacks}`);
  console.log(`  Skipped:           ${skipped}`);
  console.log(`  Total processed:   ${targets.length}`);

  await mongoose.disconnect();
  console.log(DRY_RUN ? "\n(dry run — nothing written)" : "\n✅ Images updated.");
}

main().catch((err) => {
  console.error("❌ Image backfill failed:", err);
  process.exit(1);
});
