# 📋 Görev 1.2 — MongoDB Şema Tasarımı Raporu

> **Proje:** YMT Akıllı Yemek Tarifi Web Uygulaması  
> **Sorumlu:** Zehra (Database + Öneri Motoru)  
> **Bitiş tarihi:** 12 Mayıs 2026 *(gecikmeli tamamlandı: 13 Mayıs)*  
> **Durum:** ✅ TAMAMLANDI

---

## 🎯 Görev Kapsamı

4 koleksiyon için Mongoose şemaları yazmak:
`User`, `Recipe`, `Favorite`, `MealPlan`

---

## ✅ Tamamlanan Dosyalar

| Dosya | Yol | Boyut | Durum |
|---|---|---|---|
| `User.js` | `backend/models/User.js` | ~1.9 KB | ✅ Oluşturuldu |
| `Recipe.js` | `backend/models/Recipe.js` | ~2.9 KB | ✅ Güncellendi |
| `Favorite.js` | `backend/models/Favorite.js` | ~0.8 KB | ✅ Oluşturuldu |
| `MealPlan.js` | `backend/models/MealPlan.js` | ~1.5 KB | ✅ Oluşturuldu |

---

## 🗃️ Şema Detayları

### 1. `User.js`

**Amaç:** Kimlik doğrulama ve kişiselleştirme.

| Alan | Tip | Kural |
|---|---|---|
| `name` | String | zorunlu, max 50 |
| `email` | String | zorunlu, unique, lowercase, regex doğrulama |
| `password` | String | zorunlu, min 6, `select: false` |
| `dietaryPreferences` | [String] | enum: Vejeteryan, Vegan, Glutensiz, Laktozsuz, Helal, Düşük Karbonhidrat |
| `allergies` | [String] | serbest array — öneri motorunda hariç tutma |
| `avatarUrl` | String | default: "" |
| `role` | String | enum: user / admin, default: user |
| `timestamps` | — | createdAt, updatedAt otomatik |

**Özel hooks/metodlar:**
- `pre("save")` → şifreyi bcrypt ile hashler (salt: 10)
- `matchPassword()` → giriş için hash karşılaştırması

---

### 2. `Recipe.js`

**Amaç:** Uygulamanın ana içerik modeli. Arama ve öneri motoru bu modeli kullanır.

| Alan | Tip | Kural |
|---|---|---|
| `title` | String | zorunlu, max 100, trim |
| `description` | String | zorunlu, max 500 |
| `ingredients` | [{name, amount, unit, optional}] | name + amount zorunlu |
| `instructions` | [String] | zorunlu, en az 1 adım |
| `cookTime` | Number | zorunlu, min 1 dk |
| `prepTime` | Number | default: 0 |
| `servings` | Number | default: 4, min 1 |
| `category` | String | zorunlu, enum: Kahvaltı/Çorba/Ana Yemek/Salata/Tatlı/İçecek/Atıştırmalık |
| `difficulty` | String | enum: Kolay/Orta/Zor, default: Orta |
| `tags` | [String] | default: [] |
| `imageUrl` | String | default: "" |
| `createdBy` | ObjectId | ref: User, zorunlu |
| `timestamps` | — | otomatik |

**İndeksler (performans için):**
```
{ title: "text", description: "text" }  → metin araması
{ "ingredients.name": 1 }               → malzeme araması
{ category: 1 }                         → filtreleme
{ cookTime: 1 }                         → süre filtresi
{ difficulty: 1 }                       → zorluk filtresi
{ tags: 1 }                             → tag araması
```

---

### 3. `Favorite.js`

**Amaç:** Kullanıcının favori tariflerini tutar.

| Alan | Tip | Kural |
|---|---|---|
| `userId` | ObjectId | ref: User, zorunlu |
| `recipeId` | ObjectId | ref: Recipe, zorunlu |
| `timestamps` | — | createdAt otomatik (favoriye eklenme tarihi) |

**Kritik kural:**
```js
// Aynı kullanıcı aynı tarifi iki kez ekleyemez
FavoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });
```

---

### 4. `MealPlan.js`

**Amaç:** Kullanıcının günlük öğün planını tutar.

**Alt şema — `MealSchema`:**

| Alan | Tip | Kural |
|---|---|---|
| `mealType` | String | enum: Kahvaltı/Öğle/Akşam/Ara Öğün |
| `recipeId` | ObjectId | ref: Recipe, zorunlu |
| `_id` | — | devre dışı (`_id: false`) |

**Ana şema — `MealPlanSchema`:**

| Alan | Tip | Kural |
|---|---|---|
| `userId` | ObjectId | ref: User, zorunlu |
| `date` | Date | zorunlu |
| `meals` | [MealSchema] | en az 1 öğün zorunlu |
| `notes` | String | max 300, default: "" |
| `timestamps` | — | otomatik |

**İndeks:**
```js
{ userId: 1, date: 1 }  → kullanıcının belirli tarihine hızlı erişim
```

---

## 🔗 Model İlişkileri

```
User (1) ──────┬──→ (N) Recipe        [createdBy]
               ├──→ (N) Favorite      [userId]
               └──→ (N) MealPlan      [userId]

Recipe (1) ────┬──→ (N) Favorite     [recipeId]
               └──→ (N) MealPlan.meals[recipeId]
```

---

## ⚙️ Destek Dosyaları

| Dosya | Açıklama |
|---|---|
| `backend/config/db.js` | MongoDB bağlantı fonksiyonu (`connectDB`) |
| `backend/.env.example` | Ortam değişkenleri şablonu |
| `backend/package.json` | Bağımlılıklar: mongoose, bcryptjs, dotenv, express |
| `backend/tsconfig.json` | TypeScript yapılandırması (ts-node için) |

---

## ⚠️ Bilinen Notlar

> [!NOTE]
> CLAUDE.md TypeScript + `backend/src/` yapısı gerektiriyor. Ancak ekibin repo'su JavaScript + düz `backend/` ile başladığı için **tutarlılık adına JS devam edildi**. TypeScript'e geçiş ekip kararına bırakıldı.

> [!WARNING]
> `User.js` dosyasındaki `dietaryPreferences` alanı, repo'daki orijinal `preferences.diet` alanından **farklı isimde**. Ekip ile senkronize edilmesi gerekebilir.

---

## 📌 Sıradaki Görev

**Görev 1.6 — Seed Script** (`backend/scripts/seed.ts`)
- 30 Türk tarifi
- 5 kullanıcı
- 10 favori
- 5 mealplan
