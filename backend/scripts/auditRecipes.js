/**
 * auditRecipes.js
 *
 * Read-only — Atlas'a hiç bağlanmaz, sadece seedRecipes.js'i parse edip
 * şüpheli tarif desenlerini listeler:
 *   1. Fırın geçen ama derece/süre belirtmeyen
 *   2. Fırın geçen ama derece var süre yok (veya tersi)
 *   3. cookTime ≤ 1 (placeholder)
 *   4. < 4 malzeme (eksiklik şüphesi)
 *   5. < 3 hazırlanış adımı (çok kısa)
 *   6. "10 gün", "1 hafta" gibi gün cinsinden bekleme adımı var ama
 *      prepTime/cookTime dakika olarak DEVAMSIZ (orantısız küçük)
 *
 * Tek seferlik geliştirme aracı; production'da koşulmaz.
 *
 * Run: node scripts/auditRecipes.js
 */

const path = require("path");
const fs = require("fs");

// seedRecipes.js'i require ederek `recipes` array'ine ulaşmak için module
// sistemini biraz hile yapıp recipes array'ini export ediyoruz. Seed dosyasında
// `const recipes = [...]` var ama export değil. Bu yüzden file'ı string olarak
// okuyup eval ile gerekli kısmı çıkartmak yerine `Recipe` modeline ihtiyacımız
// olmadığı için seedRecipes.js'in body'sini ayıklayıp Function ile parse ediyoruz.
const seedFile = path.join(__dirname, "seedRecipes.js");
const seedSource = fs.readFileSync(seedFile, "utf8");

// `const recipes = [` ... `];` bloğunu yakala
const start = seedSource.indexOf("const recipes = [");
const arrayStart = seedSource.indexOf("[", start);
if (arrayStart === -1) {
  console.error("seedRecipes.js içinde 'const recipes = [' bulunamadı");
  process.exit(1);
}

// Brace matcher — closing ];'yi bul
let depth = 0;
let arrayEnd = -1;
for (let i = arrayStart; i < seedSource.length; i++) {
  if (seedSource[i] === "[") depth++;
  else if (seedSource[i] === "]") {
    depth--;
    if (depth === 0) {
      arrayEnd = i;
      break;
    }
  }
}
if (arrayEnd === -1) {
  console.error("Array'in sonu bulunamadı");
  process.exit(1);
}

const arrayLiteral = seedSource.slice(arrayStart, arrayEnd + 1);
const recipes = new Function(`return ${arrayLiteral};`)();

console.log(`Toplam tarif: ${recipes.length}\n`);

// ── Şüphe Detektörleri ────────────────────────────────────────────────────────

const TEMPERATURE_RE = /\b\d{2,3}\s*°?C\b|\b\d{2,3}\s*derece/i;
const DURATION_RE = /\b\d+\s*(dk|dakika|saat|sa|gün)\b/i;
const FIRIN_RE = /\bfırın/i;
const DAY_WAIT_RE = /\b(\d+(-\d+)?)\s*(gün|hafta)\b/i;

const suspicious = [];

recipes.forEach((r, idx) => {
  const issues = [];
  const instructionsText = (r.instructions || []).join(" ");

  // 1. Fırın geçen ama derece YOK
  if (FIRIN_RE.test(instructionsText) && !TEMPERATURE_RE.test(instructionsText)) {
    issues.push("FIRIN: derece belirtilmemiş");
  }

  // 2. Fırın geçen ama süre YOK (fırına ilişkin tek bir dakika belirtisi yoksa)
  if (FIRIN_RE.test(instructionsText) && !DURATION_RE.test(instructionsText)) {
    issues.push("FIRIN: süre belirtilmemiş");
  }

  // 3. cookTime placeholder
  if (r.cookTime != null && r.cookTime <= 1) {
    issues.push(`SÜRE: cookTime=${r.cookTime} (placeholder şüphesi)`);
  }

  // 4. Az malzeme
  if (!r.ingredients || r.ingredients.length < 4) {
    issues.push(`MALZEME: ${r.ingredients?.length ?? 0} adet (az)`);
  }

  // 5. Çok kısa hazırlanış
  if (!r.instructions || r.instructions.length < 3) {
    issues.push(`ADIMLAR: ${r.instructions?.length ?? 0} adım (kısa)`);
  }

  // 6. Gün bekleme + tutarsız süre (10 gün geçiyor ama prepTime 5 dk gibi)
  const dayMatch = instructionsText.match(DAY_WAIT_RE);
  if (dayMatch) {
    const days = parseInt(dayMatch[1].split("-")[0], 10);
    const expectedMinutes = days * 24 * 60;
    const declaredMinutes = (r.prepTime ?? 0) + (r.cookTime ?? 0);
    // Beyan edilen süre, gün cinsinden bekleme süresinin %50'sinin altındaysa eksik
    if (declaredMinutes < expectedMinutes * 0.5) {
      issues.push(
        `BEKLEME: hazırlanışta "${dayMatch[0]}" geçiyor ama prepTime+cookTime=${declaredMinutes} dk (= ${Math.round(declaredMinutes / 60 / 24)} gün)`
      );
    }
  }

  if (issues.length > 0) {
    suspicious.push({ idx: idx + 1, title: r.title, category: r.category, issues });
  }
});

// ── Çıktı ─────────────────────────────────────────────────────────────────────

console.log(`Şüpheli tarif sayısı: ${suspicious.length}\n`);

// Severity'ye göre sırala: birden çok issue olanlar üstte
suspicious.sort((a, b) => b.issues.length - a.issues.length);

suspicious.forEach((r) => {
  console.log(`#${r.idx.toString().padStart(3)} [${r.category}] ${r.title}`);
  r.issues.forEach((i) => console.log(`     - ${i}`));
  console.log();
});
