/**
 * Pixabay görsellerini diske indirip yerel olarak servis edilebilir hale getirir.
 *
 * Neden? Pixabay'in API'sinden dönen direkt görsel URL'leri ~24 saat sonra
 * expire oluyor (400 Bad Request). Bu script görselleri bir kez indirip
 * backend/public/images/ altına kaydeder ve DB'deki imageUrl'i
 * /images/<recipeId>.<ext> olarak günceller. server.js bu klasörü statik servis eder.
 *
 * Çalıştır:  node scripts/downloadImages.js   (veya: npm run images:download)
 *
 * NOT: Node 20+ global fetch kullanır.
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");

const IMAGES_DIR = path.join(__dirname, "..", "public", "images");
const HTTP_DELAY_MS = 700; // Pixabay'i yormamak için her indirme arası bekleme

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// content-type veya URL'den dosya uzantısını belirle
function getExtension(contentType, url) {
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return ".jpg";
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("gif")) return ".gif";
  const match = url.match(/\.(jpg|jpeg|png|webp|gif)/i);
  return match ? `.${match[1].toLowerCase()}` : ".jpg";
}

async function downloadImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }

    // Sadece harici (pixabay) URL'li tarifleri indir — zaten /images/ olanları değil
    const recipes = await Recipe.find({
      imageUrl: { $regex: "^https?://.*pixabay", $options: "i" },
    });
    console.log(`Toplam ${recipes.length} adet Pixabay görseli bulundu.`);

    let success = 0;
    let skipped = 0;
    let failed = 0;

    for (const recipe of recipes) {
      try {
        const response = await fetch(recipe.imageUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; RecipeImageDownloader/1.0)",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.startsWith("image/")) {
          throw new Error(`Beklenmeyen içerik tipi: ${contentType}`);
        }

        const ext = getExtension(contentType, recipe.imageUrl);
        const imagePath = path.join(IMAGES_DIR, `${recipe._id}${ext}`);
        const localImageUrl = `/images/${recipe._id}${ext}`;

        // Zaten indirilmiş ve DB güncellenmişse atla
        if (recipe.imageUrl === localImageUrl && fs.existsSync(imagePath)) {
          console.log(`Atlandı (zaten mevcut): ${recipe._id}${ext}`);
          skipped++;
          continue;
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.length === 0) {
          throw new Error("Boş dosya indirildi");
        }

        fs.writeFileSync(imagePath, buffer);

        // Eski uzantılı dosya varsa temizle (örn. .jpg → .webp)
        for (const oldExt of [".jpg", ".png", ".webp", ".gif"]) {
          const oldPath = path.join(IMAGES_DIR, `${recipe._id}${oldExt}`);
          if (oldPath !== imagePath && fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        recipe.imageUrl = localImageUrl;
        await recipe.save();

        console.log(`Başarılı: ${recipe._id}${ext}`);
        success++;

        await sleep(HTTP_DELAY_MS);
      } catch (err) {
        console.error(`Hata - ${recipe._id}:`, err.message);
        failed++;
      }
    }

    console.log(`Tamamlandı. Başarılı: ${success}, Atlanan: ${skipped}, Hatalı: ${failed}`);
  } catch (error) {
    console.error("Genel hata:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Veritabanı bağlantısı kapatıldı.");
  }
}

downloadImages();
