/**
 * Tarif malzeme miktarlarını porsiyon çarpanıyla güvenli ölçekler.
 *
 * Backend `Recipe.ingredients[].amount` tipi STRING — gerçek değerler:
 *  - Düz sayı: "2", "1.5", "0,5"
 *  - Kesir: "1/2", "1/4"
 *  - Sayı + birim metni: "2 yemek kaşığı", "1 su bardağı"
 *  - Sayısız metin: "yarım", "tutam"
 *
 * Bu fonksiyon string'in başındaki sayıyı parse eder, multiplier ile çarpar
 * ve gerisini olduğu gibi bırakır. Parse edilemezse string'i değiştirmeden
 * döner — kullanıcıya "NaN" göstermek yerine orijinal metni korur.
 *
 * Frontend amount tipi `string | number` olarak korunur (backend ile uyumlu).
 *
 * @param amount   Backend'den gelen ham miktar (string ya da number)
 * @param multiplier  Hedef porsiyon / orijinal porsiyon oranı (örn. 8/4 = 2)
 * @returns Görüntülenecek miktar string'i
 */
export function scaleAmount(
  amount: string | number | undefined,
  multiplier: number
): string {
  if (amount === undefined || amount === null || amount === "") return "";
  if (typeof amount === "number") {
    return formatNumber(amount * multiplier);
  }

  const raw = String(amount).trim();
  if (raw === "") return "";

  // Sayı + (opsiyonel) açıklayıcı metin yakalar. Sayı: tamsayı, ondalık (. veya ,),
  // veya basit kesir (a/b). İlk pozisyonda olmak zorunda.
  const match = raw.match(/^(\d+\/\d+|\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (!match) return raw; // Sayı yok — olduğu gibi döner ("yarım", "tutam")

  const [, numStr, rest] = match;
  let num: number;
  if (numStr.includes("/")) {
    const [a, b] = numStr.split("/").map(Number);
    if (!b) return raw; // 1/0 gibi geçersiz
    num = a / b;
  } else {
    num = parseFloat(numStr.replace(",", "."));
  }
  if (!Number.isFinite(num)) return raw;

  const scaled = formatNumber(num * multiplier);
  return rest ? `${scaled} ${rest}` : scaled;
}

/**
 * Sayıyı kullanıcı dostu formatla:
 *  - Tamsayı ise: "8"
 *  - Ondalık ise en fazla 2 hane, gereksiz sıfırları kırp: "1.5", "0.75"
 *  - Çok büyük/çok küçük edge case yok (tariflerde gerçekçi aralık)
 */
function formatNumber(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return Number(n.toFixed(2))
    .toString()
    .replace(/\.?0+$/, "");
}
