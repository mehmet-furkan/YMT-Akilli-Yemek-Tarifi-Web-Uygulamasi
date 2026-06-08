/**
 * Tarif malzeme miktarlarını porsiyon çarpanıyla güvenli ölçekler ve birim
 * türüne göre KULLANIŞLI yuvarlama yapar (örn. "1.17 kg" yerine "1.2 kg",
 * "233.33 gram" yerine "235 gram", "1.17 adet limon" yerine "1 adet limon").
 *
 * Backend `Recipe.ingredients[].amount` tipi STRING — gerçek değerler:
 *  - Düz sayı: "2", "1.5", "0,5"
 *  - Kesir: "1/2", "1/4"
 *  - Sayı + birim metni: "2 yemek kaşığı"
 *  - Sayısız metin: "yarım", "tutam"
 *
 * Bu fonksiyon string'in başındaki sayıyı parse eder, multiplier ile çarpar
 * ve `unit` parametresine göre uygun "güzel sayı" hassasiyetine yuvarlar.
 * Parse edilemezse string'i değiştirmeden döner — kullanıcıya "NaN" göstermek
 * yerine orijinal metni korur.
 *
 * @param amount     Backend'den gelen ham miktar (string ya da number)
 * @param multiplier Hedef porsiyon / orijinal porsiyon oranı (örn. 8/4 = 2)
 * @param unit       Malzemenin birimi ("kg", "gram", "adet", "yemek kaşığı"...)
 * @returns Görüntülenecek miktar string'i
 */
export function scaleAmount(
  amount: string | number | undefined,
  multiplier: number,
  unit?: string
): string {
  if (amount === undefined || amount === null || amount === "") return "";
  if (typeof amount === "number") {
    return formatNumber(smartRound(amount * multiplier, unit));
  }

  const raw = String(amount).trim();
  if (raw === "") return "";

  // Sayı + (opsiyonel) açıklayıcı metin. Sayı: tamsayı, ondalık (. veya ,),
  // veya basit kesir (a/b). Sayı string'in başında olmalı.
  const match = raw.match(/^(\d+\/\d+|\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (!match) return raw; // Sayısız metin ("yarım", "tutam") aynen kalır

  const [, numStr, rest] = match;
  let num: number;
  if (numStr.includes("/")) {
    const [a, b] = numStr.split("/").map(Number);
    if (!b) return raw;
    num = a / b;
  } else {
    num = parseFloat(numStr.replace(",", "."));
  }
  if (!Number.isFinite(num)) return raw;

  // Yuvarlama birimi belirlenirken hem ayrı `unit` parametresi hem de amount
  // string'inin içine yapışmış birim metni ("2 yemek kaşığı") değerlendirilir.
  const effectiveUnit = (unit ?? "") || rest;
  const scaled = formatNumber(smartRound(num * multiplier, effectiveUnit));
  return rest ? `${scaled} ${rest}` : scaled;
}

/**
 * Birime göre "güzel sayı" yuvarlama. Tariflerde "0.83 kaşık" gibi sayılar
 * kullanışsız — birim cinsinin doğal hassasiyetine snap eder.
 */
function smartRound(value: number, unit?: string): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  const u = (unit ?? "").toLowerCase().trim();

  // Kaşık ölçüleri — 0.5 hassasiyeti doğal (yarım kaşık)
  if (u.includes("kaşığı") || u === "kaşık" || u.includes("kasik")) {
    return roundTo(value, 0.5, 0.5);
  }

  // Bardak ölçüleri — 1/4 hassasiyeti doğal (1.25 / 1.5 bardak)
  if (u.includes("bardağı") || u.includes("bardak")) {
    return roundTo(value, 0.25, 0.25);
  }

  // Sayılabilir bütünler — tam sayıya yuvarla (1.17 limon yerine 1 limon)
  if (
    u === "adet" ||
    u === "tane" ||
    u.includes("baş") ||
    u === "dilim" ||
    u === "demet" ||
    u === "paket" ||
    u === "kutu" ||
    u === "şişe" ||
    u === "" // birim yoksa tam sayıya gitmek genelde güvenli
  ) {
    return Math.max(1, Math.round(value));
  }

  // Tutam / fiske / çimdik — tam sayı, alttan en az 1
  if (u.includes("tutam") || u.includes("fiske") || u.includes("çimdik")) {
    return Math.max(1, Math.round(value));
  }

  // Gram, ml — magnitude'a göre kullanışlı yuvarlama
  if (u === "gram" || u === "gr" || u === "g" || u === "ml") {
    if (value < 10) return Math.max(1, Math.round(value));
    if (value < 100) return roundTo(value, 5, 5);
    if (value < 500) return roundTo(value, 10, 10);
    if (value < 1000) return roundTo(value, 25, 25);
    return roundTo(value, 50, 50);
  }

  // Kg, litre — 1'in altında 1/4, 1-5 arası 0.5, üstü tam sayı
  if (u === "kg" || u === "litre" || u === "lt" || u === "l") {
    if (value < 1) return roundTo(value, 0.25, 0.25);
    if (value < 5) return roundTo(value, 0.5, 0.5);
    return Math.round(value);
  }

  // Bilinmeyen birim — 1 ondalık yeterli
  return Math.round(value * 10) / 10;
}

/** Verilen step'in en yakın katına yuvarlar, alttan minimum'u garanti eder. */
function roundTo(value: number, step: number, minimum: number): number {
  const rounded = Math.round(value / step) * step;
  return Math.max(minimum, rounded);
}

/** Sayıyı kullanıcı dostu formatla (gereksiz sıfırları kırpar). */
function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "0";
  if (Number.isInteger(n)) return String(n);
  return Number(n.toFixed(2))
    .toString()
    .replace(/\.?0+$/, "");
}
