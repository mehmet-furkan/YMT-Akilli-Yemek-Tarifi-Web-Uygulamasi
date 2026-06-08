/**
 * Dakika cinsinden süreyi insan okuyabilir Türkçe ifadeye çevirir.
 *
 * Çoğu tarif 5–60 dk aralığında olur ama fermente içecek/yoğurt/turşu gibi
 * tariflerde süreler **günlere** gidebilir (örn. şalgam suyu ≈ 17280 dk = 12 gün).
 * "17281 dk" göstermek anlamsız — bunun yerine en büyük birimi öne çıkarırız.
 *
 * Kurallar:
 *  - < 60 dk     → "30 dk"
 *  - 60–1439 dk  → "1 sa 30 dk" (dakika 0 ise sadece "2 sa")
 *  - ≥ 1440 dk   → "12 gün" / "1 gün 2 sa" (dakika düşürülür — çok-günlü tariflerde gürültüye dönüşür)
 *
 * Edge case'ler:
 *  - undefined/null/0/negatif → "0 dk"
 */
export function formatDuration(minutes: number | undefined | null): string {
  if (!minutes || minutes <= 0 || !Number.isFinite(minutes)) {
    return "0 dk";
  }

  if (minutes < 60) {
    return `${Math.round(minutes)} dk`;
  }

  const days = Math.floor(minutes / 1440);
  const afterDays = minutes - days * 1440;
  const hours = Math.floor(afterDays / 60);
  const mins = afterDays - hours * 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} gün`);
  if (hours > 0) parts.push(`${hours} sa`);
  // Dakika sadece günsüz tariflerde gösterilir; aksi gürültü yaratır
  if (mins > 0 && days === 0) parts.push(`${Math.round(mins)} dk`);

  return parts.join(" ") || `${minutes} dk`;
}
