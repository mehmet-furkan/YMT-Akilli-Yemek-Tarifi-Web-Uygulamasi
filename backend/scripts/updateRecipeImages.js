/**
 * Backfill imageUrl for every Recipe with an empty imageUrl.
 *
 * Strategy (in order):
 *  1. Pixabay API (best — unique photo per recipe title). Requires
 *     PIXABAY_API_KEY in .env. Free tier: 5000 req/hour.
 *  2. TheMealDB search API (no key, but mostly non-Turkish meals).
 *  3. Category-default Unsplash photo (same image per category).
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
 *   --no-pixabay skip Pixabay even if key is present (debug / quota saving)
 */
require("dotenv").config();
const mongoose = require("mongoose");
const https = require("https");
const Recipe = require("../models/Recipe");

const FORCE = process.argv.includes("--force");
const DRY_RUN = process.argv.includes("--dry-run");
const NO_PIXABAY = process.argv.includes("--no-pixabay");
const PIXABAY_KEY = process.env.PIXABAY_API_KEY;

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Pixabay free tier: 100 requests / 60s. With ~5 attempts per recipe in the
// worst case, we throttle every HTTP call to 700ms (~85 req/min). This adds
// ~70s of wait across 100 recipes but eliminates silent {hits: []} responses
// caused by rate limiting.
const HTTP_DELAY_MS = 700;

async function fetchJson(url) {
  const result = await new Promise((resolve, reject) => {
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
  await sleep(HTTP_DELAY_MS);
  return result;
}

// Pixabay rarely tags photos with specific Turkish dish names. For dishes that
// our Pixabay test runs returned 0 hits on, map to an English search term that
// reliably yields a relevant photo. Order: Pixabay tries this English term
// first, then falls back to the original Turkish title with various filters.
const pixabayKeywords = {
  "Türk Kahvesi": "turkish coffee",
  "Ayran": "yogurt drink",
  "Salep": "hot milk drink",
  "Şalgam Suyu": "turnip juice",
  "Limonata": "lemonade",
  "Sigara Böreği": "turkish pastry borek",
  "Su Böreği": "turkish pastry borek",
  "Çiğ Köfte (Etsiz)": "bulgur balls",
  "Patates Köftesi": "potato fritter",
  "Simit (Ev Yapımı)": "turkish bagel simit",
  "Revani": "semolina cake",
  "Kadayıf Cevizli": "kadayif dessert",
  "Kabak Tatlısı": "candied pumpkin",
  "Trileçe": "tres leches cake",
  "Tulumba": "fried dough syrup",
  "Sakızlı Muhallebi": "milk pudding",
  "Profiterol": "profiterole",
  "Magnolia": "trifle dessert",
  "Cheesecake (Pişmemiş)": "cheesecake",
};

async function findPixabayImage(title) {
  if (!PIXABAY_KEY || NO_PIXABAY) return null;
  const food = `https://pixabay.com/api/?key=${PIXABAY_KEY}&image_type=photo&category=food&safesearch=true&per_page=3`;
  // Pixabay has no `drink` category, so the 4th attempt drops the food filter
  // to catch beverages (Ayran, Salep, ...) and modern desserts (Trileçe,
  // Profiterol, ...) that Pixabay tags outside `food`.
  const open = `https://pixabay.com/api/?key=${PIXABAY_KEY}&image_type=photo&safesearch=true&per_page=3`;
  // Strip parenthesized suffixes ("(Etsiz)", "(Ev Yapımı)") for cleaner search
  const cleaned = title.replace(/\s*\([^)]*\)\s*/g, "").trim();
  const englishOverride = pixabayKeywords[title];
  const attempts = [];
  // If we have a curated English term, try it FIRST — these are tuned for
  // dishes Pixabay can't find with the Turkish name.
  if (englishOverride) {
    attempts.push(`${open}&q=${encodeURIComponent(englishOverride)}`);
  }
  attempts.push(
    `${food}&q=${encodeURIComponent(cleaned)}&lang=tr`,
    `${food}&q=${encodeURIComponent(cleaned)}`,
    `${food}&q=${encodeURIComponent("turkish " + cleaned)}`,
    `${open}&q=${encodeURIComponent(cleaned)}`,
  );
  for (const url of attempts) {
    try {
      const data = await fetchJson(url);
      if (data && Array.isArray(data.hits) && data.hits.length > 0) {
        return data.hits[0].webformatURL;
      }
    } catch (err) {
      console.warn(`  ! Pixabay lookup failed for "${title}": ${err.message}`);
      return null;
    }
  }
  return null;
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
  if (PIXABAY_KEY && !NO_PIXABAY) console.log("✓ Pixabay key detected — using as primary source");
  else if (NO_PIXABAY) console.log("⚠ Pixabay disabled via --no-pixabay flag");
  else console.log("⚠ No PIXABAY_API_KEY in .env — falling back to TheMealDB + category default");

  const filter = FORCE ? {} : { $or: [{ imageUrl: "" }, { imageUrl: { $exists: false } }] };
  const targets = await Recipe.find(filter).select("title category imageUrl").lean();
  console.log(`Found ${targets.length} recipe(s) needing an image\n`);

  let pixabayHits = 0;
  let themealdbHits = 0;
  let categoryFallbacks = 0;
  let skipped = 0;

  for (const recipe of targets) {
    let url = await findPixabayImage(recipe.title);
    let source = "pixabay";
    if (!url) {
      url = await findThemealdbImage(recipe.title);
      source = "themealdb";
    }
    if (!url) {
      url = categoryFallback[recipe.category];
      source = "fallback";
    }
    if (!url) {
      console.log(`  ? ${recipe.title} (${recipe.category}) — no image found, skipping`);
      skipped++;
      continue;
    }

    if (source === "pixabay") pixabayHits++;
    else if (source === "themealdb") themealdbHits++;
    else categoryFallbacks++;

    const marker = source === "pixabay" ? "★" : source === "themealdb" ? "✓" : "·";
    console.log(`  ${marker} [${source}] ${recipe.title}`);
    if (!DRY_RUN) {
      await Recipe.updateOne({ _id: recipe._id }, { $set: { imageUrl: url } });
    }
  }

  console.log("\n--- Summary ---");
  console.log(`  Pixabay hits:      ${pixabayHits}`);
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
