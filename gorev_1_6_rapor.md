# 📋 Görev 1.6 — Seed Script Raporu

> **Proje:** YMT Akıllı Yemek Tarifi Web Uygulaması
> **Sorumlu:** Zehra (Database + Öneri Motoru)
> **Bitiş tarihi:** 13 Mayıs 2026
> **Durum:** ✅ Dosya Hazır — ⏳ MongoDB bağlantısı bekleniyor

---

## 🎯 Görev Kapsamı

`backend/scripts/seed.ts` dosyasını yazmak:
- 30 Türk tarifi
- 5 kullanıcı (farklı diyet tercihleriyle)
- 10 favori kaydı
- 5 meal plan (günlük öğün planı)

---

## ✅ Oluşturulan Dosyalar

| Dosya | Yol | Durum |
|---|---|---|
| `seed.ts` | `backend/scripts/seed.ts` | ✅ Yazıldı |
| `.env` | `backend/.env` | ✅ Oluşturuldu |
| `tsconfig.json` | `backend/tsconfig.json` | ✅ Oluşturuldu |

---

## 🗂️ Seed İçeriği

### 5 Kullanıcı

| İsim | E-posta | Diyet Tercihi |
|---|---|---|
| Zehra Kaya | zehra@test.com | Vejeteryan |
| Ahmet Yılmaz | ahmet@test.com | — |
| Fatma Demir | fatma@test.com | Vegan |
| Mehmet Şahin | mehmet@test.com | Glutensiz |
| Ayşe Çelik | ayse@test.com | Laktozsuz |

> [!NOTE]
> Şifreler bcrypt pre-save hook ile otomatik hashlenir. Ham şifre: `Test1234`

---

### 30 Tarif — Kategori Dağılımı

| Kategori | Adet | Tarifler |
|---|---|---|
| **Kahvaltı** | 5 | Menemen, Poğaça, Kaygana, Peynirli Omlet, Çılbır |
| **Çorba** | 5 | Mercimek, Ezogelin, Yayla, Domates, Tarhana |
| **Ana Yemek** | 10 | Kuru Fasulye, Mantı, İmam Bayıldı, Karnıyarık, Köfte, Tavuk Sote, Pilav, Nohut, Bezelye, Döner Tavuk |
| **Salata** | 4 | Çoban, Semizotu, Patlıcan, Mevsim |
| **Tatlı** | 4 | Baklava, Sütlaç, Kazandibi, Aşure |
| **İçecek** | 2 | Ayran, Türk Kahvesi |
| **Toplam** | **30** | |

**Zorluk dağılımı:** Kolay: 18 — Orta: 9 — Zor: 3 (Mantı, Baklava, Kazandibi)

**Pişirme süreleri:** 0 dk (salatalar) → 120 dk (aşure, döner marine)

---

### 10 Favori Kaydı

| Kullanıcı | Favori Tarifler |
|---|---|
| Zehra | Menemen, Mercimek Çorbası |
| Ahmet | Kuru Fasulye, Mantı |
| Fatma | Çoban Salatası, Baklava |
| Mehmet | Köfte, Kaygana |
| Ayşe | Ayran, Türk Kahvesi |

> [!NOTE]
> Compound unique index sayesinde aynı kullanıcı aynı tarifi iki kez ekleyemez.

---

### 5 Meal Plan

| Kullanıcı | Tarih | Öğünler |
|---|---|---|
| Zehra | Bugün | Menemen / Mercimek Çorbası / Kuru Fasulye |
| Zehra | Yarın | Poğaça / Ezogelin / Mantı |
| Ahmet | Bugün | Peynirli Omlet / Köfte |
| Fatma | Bugün+2 | Yayla Çorbası / Bezelye / Ayran |
| Mehmet | Yarın | Kaygana / Pilav |

---

## ⚙️ Script Akışı

1. MongoDB'ye bağlan
2. Eski veriyi temizle (`deleteMany`)
3. 5 kullanıcı oluştur (şifre hash otomatik)
4. 30 tarif oluştur
5. 10 favori ekle
6. 5 mealplan ekle
7. Bağlantıyı kapat

**Beklenen konsol çıktısı:**
```
✅ MongoDB bağlandı
🗑️  Eski veriler silindi
✅ 30 recipe, 5 user, 10 favorite, 5 mealplan eklendi
```

---

## 🚀 Çalıştırma Adımları

```bash
npm install        # bağımlılıkları yükle (bir kez)
# .env içinde MONGO_URI'yi ayarla
npm run seed       # seed'i çalıştır
```

---

## 🔌 MongoDB Bağlantı Seçenekleri

### A — MongoDB Atlas (Önerilen, kurulum gerektirmez)
1. [cloud.mongodb.com](https://cloud.mongodb.com) → Ücretsiz hesap aç
2. Free Cluster → Connect → Drivers → connection string kopyala
3. `.env` dosyasını güncelle:
```env
MONGO_URI=mongodb+srv://<kullanici>:<sifre>@cluster0.xxxxx.mongodb.net/ymt-akilli-yemek
```

### B — Lokal MongoDB
1. [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) → indir ve kur
2. Windows Services'ten MongoDB servisini başlat
3. `.env` zaten hazır:
```env
MONGO_URI=mongodb://localhost:27017/ymt-akilli-yemek
```

---

## ⚠️ Bilinen Notlar

> [!WARNING]
> `npm run seed` çalıştırıldığında **tüm mevcut veriler silinir**. Production ortamında kullanma!

> [!NOTE]
> `package.json`'a `"seed": "ts-node scripts/seed.ts"` komutu eklendi. TypeScript desteği için `tsconfig.json` hazır.

---

## 📌 Sıradaki Görevler

| Görev | Tarih | Açıklama |
|---|---|---|
| **MongoDB Bağlantısı** | — | Atlas veya lokal MongoDB kur, seed'i çalıştır |
| **2.3 Favoriler API** | 18 May | GET/POST/DELETE /api/favorites |
| **2.4 Öneri Motoru** | 20 May | Malzeme eşleşme skoru algoritması |
