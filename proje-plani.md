# 🍳 Akıllı Yemek Tarifi Web Uygulaması — Proje Planı

> **Repo:** [mehmet-furkan/YMT-Akilli-Yemek-Tarifi-Web-Uygulamasi](https://github.com/mehmet-furkan/YMT-Akilli-Yemek-Tarifi-Web-Uygulamasi)
> **Süre:** 8-28 Mayıs 2026 (20 gün)
> **Ekip:** 7 kişi (1. sınıf yazılım mühendisliği öğrencileri)
> **Teslim Edilecekler:** Kullanıcı kayıt/giriş, tarif arama+filtreleme, kişiselleştirilmiş öneri motoru, mobil uyumlu arayüz
> **Yöntem:** Google Antigravity + AI agent'ları ile geliştirme

---

## 📌 Repo Mevcut Durum (8 Mayıs 2026 itibarıyla)

| Alan | Durum | Not |
|---|---|---|
| Backend iskeleti | ✅ Var | `backend/` altında Express yapısı (config, controllers, middleware, models, routes) |
| `package.json` + `.env.example` | ✅ Var | Bağımlılıklar yüklü |
| Frontend (`client/`) | ❌ **YOK** | İlk kritik açık — Faz 0'a alındı |
| `CLAUDE.md` (AI kuralları) | ❌ **YOK** | Acil — Faz 0'da yapılacak |
| MongoDB modelleri | 🟡 Kısmen | Detay incelenmeli, eksik koleksiyonlar olabilir |
| API contract (OpenAPI) | ❌ Yok | Faz 1'de yapılacak |
| Seed data | ❌ Yok | Faz 1'de yapılacak |
| Branch protection | ✅ Var | projeakisi.md'de doğrulandı |
| Vizyon belgesi | ✅ Var | projeakisi.md'de mevcut |

---

## 👥 Ekip ve Roller

| # | İsim | Birincil Rol | Pair |
|---|---|---|---|
| 1 | **Mehmet Furkan** (PM) | Proje Yönetimi + Backend (entegrasyon) | A |
| 2 | **Muhammed Ali Yücel** | Auth + Güvenlik | A |
| 3 | **Emre Cansever** | Frontend (lead) | B |
| 4 | **Furkan Yılmaz** | UI/UX + Frontend destek | B |
| 5 | **Emine Zehra Duyar** | Database + Öneri motoru | C |
| 6 | **Muhammed Hanifi Taş** | DevOps + Logging + Deploy | C |

> **Pair çalışma kuralı:** Her pair kendi alanında ortaklaşa çalışır, birbirinin AI çıktısını review eder. Biri takılırsa diğeri devralır.

---

## 🗓️ Takvim Özeti

| Faz | Tarih | Gün | Ana Çıktı |
|---|---|---|---|
| **Faz 0** | 9-10 May | 2 gün | Frontend iskeleti + AI kuralları + ekip senkron |
| **Faz 1** | 11-13 May | 3 gün | API contract dondu, şema tamam, seed data hazır |
| **Faz 2** | 14-20 May | 7 gün | Uçtan uca çekirdek özellikler çalışıyor |
| **Faz 3** | 21-25 May | 5 gün | QA, mobil, güvenlik, performans |
| **Faz 4** | 26-30 May | 4 gün | Cila + production deploy + sunum |

---

## 🤖 AI ile Çalışma Altın Kuralları

> Bu kuralları ekipteki herkes okusun. Faz 0 başlamadan!

1. **Her prompt 4 parçadan oluşur:** (1) Bağlam, (2) Net görev, (3) Kabul kriterleri, (4) Kısıtlar.
2. **AI'a büyük görev verme.** "Tüm auth sistemini yap" yerine "şu spec'e göre login endpoint'ini yaz" de.
3. **Yazılan kodu mutlaka çalıştır.** "AI yazdı, gönderdim" yasak. Lokal build + tıklama olmadan PR açılmaz.
4. **TypeScript kullan, JS değil.** AI hatalarının çoğu derlemede yakalanır → bedava QA.
5. **Test verisi (seed) çok kritik.** Boş DB ile UI test etmek yanıltır.
6. **Güvenlik kodunu iki kişi review etsin.** AI auth/şifre kodunu bazen *insecure* yazar.
7. **Anlamadığın kodu merge etme.** Commit mesajını AI yazabilir, ama PR açıklamasını insan yazar.
8. **`CLAUDE.md` dosyası kraldır.** Kod stili, klasör yapısı, "yapma" listesi orada. Tüm agent'lar onu okur.

---

# 🟦 FAZ 0 — Hazırlık & Ortam (9-10 Mayıs · 2 gün)

> **Amaç:** Kod yazmaya başlamadan önce herkes aynı sayfada, frontend iskeleti hazır, AI kuralları yazılmış olsun.

---

## 0.1 — Frontend (`client/`) iskeletini oluştur ⚠️ KRİTİK
**Sorumlu:** Hanifi
**Bitiş:** 10 May
**Ne demek:** Backend var, frontend yok. Repo root'una `client/` klasörü açıp boş bir React + TS + Vite + Tailwind projesi kur. Backend `backend/` zaten var, ona dokunma.

**AI Prompt:**
```
Mevcut bir Node.js + Express backend repo'sunda /backend klasörü var.
Bunun yanına /client klasörü oluştur:
- Vite + React 18 + TypeScript
- Tailwind CSS (config + index.css)
- React Router v6
- React Query (TanStack Query) for API calls
- Axios for HTTP client
- /client/src/pages, /client/src/components, /client/src/lib, /client/src/contexts klasör yapısı
- Boş bir HomePage component'i olsun, /api/health endpoint'ine istek atıp ekrana bassın
- /client/.env.example'a VITE_API_URL=http://localhost:5000 yaz
- Root'a bir docker-compose.yml ekle: MongoDB + backend + client'ı kaldıran
- Root'a bir README ekle: hem backend hem client için kurulum adımları

Mevcut /backend klasörünün package.json'ına ve dosyalarına DOKUNMA.
```

**Doğrulama:** `cd client && npm install && npm run dev` çalışıyor, browser'da backend'e bağlanan boş sayfa açılıyor.

---

## 0.2 — `CLAUDE.md` dosyası (AI kuralları) ⚠️ KRİTİK
**Sorumlu:** Mehmet Furkan
**Bitiş:** 10 May
**Ne demek:** Repo root'una agent'ların okuyacağı kurallar dosyası. **Bu olmazsa her ekip üyesinin AI'sı farklı stil yazar, kod karman çorman olur.**

**AI Prompt:**
```
Bana bir CLAUDE.md dosyası yaz. Bu dosya AI agent'larına proje kurallarını öğretmek için.

Proje: Akıllı Yemek Tarifi web uygulaması
Stack: React 18 + TypeScript + Vite + Tailwind (frontend)
       Node.js + Express + TypeScript + Mongoose (backend)
       MongoDB
Ekip: 1. sınıf yazılım mühendisliği öğrencileri, AI ile geliştirme yapıyoruz.

Dosya şunları içersin:
- Proje yapısı (klasör ağacı)
- Naming convention (camelCase fn, PascalCase component, UPPER_SNAKE const)
- Async/await zorunlu (Promise.then yasak)
- Hata yönetimi pattern'i: backend için custom Error class + global errorHandler middleware
- Validation: zod kullan, her endpoint'te request body validate
- Response shape standardı: { data: ..., error: ..., meta: ... }
- Hiçbir endpoint'te password field'ı response'a koyma
- console.log yerine logger kullan
- Env değişkenleri sadece /lib/env.ts üzerinden okunsun (zod ile validate)
- Commit format: conventional commits (feat:, fix:, chore:, docs:)
- "YAPMA" listesi: any type kullanma, dangerouslySetInnerHTML kullanma, password log'lama, hardcoded secret koyma
- Test: Jest + Supertest backend, Vitest + Testing Library frontend

Dosya net, madde madde, açıklayıcı ama kısa olsun. 1. sınıflar için yazıyoruz, jargon az olsun.
```

**Doğrulama:** Dosyayı okuduğunda "tamam bu projede şöyle yazılır" diyebiliyorsan iş tamam. Repo root'unda `CLAUDE.md` olarak commit edilmiş.

---

## 0.3 — Mevcut backend'i denetle & eksikleri belirle
**Sorumlu:** Mehmet Furkan + Ali
**Bitiş:** 10 May
**Ne demek:** Backend yapısı var ama içinde ne kadar kod yazılmış belli değil. Sen ve Ali tek tek `models/`, `routes/`, `controllers/`, `middleware/`'i okuyun. Eksikleri ve yanlış olanları not edin.

**Kontrol listesi:**
- [ ] `package.json`'da hangi paketler var? (express, mongoose, bcrypt, jsonwebtoken, zod, dotenv, cors, helmet, express-rate-limit kontrol et)
- [ ] `.env.example`'da hangi değişkenler var? (MONGODB_URI, JWT_SECRET, PORT, NODE_ENV minimum)
- [ ] `models/` altında hangi şemalar var? Eksik olanları listele.
- [ ] `routes/` altında hangi endpoint'ler var? OpenAPI'mizle uyumlu mu?
- [ ] `middleware/` altında auth middleware var mı?
- [ ] `server.js` MongoDB'ye bağlanıyor mu, error handling var mı?

**AI Prompt (denetim raporu için):**
```
Aşağıda bir Express + Mongoose backend projesinin dosya içerikleri var:
[backend/server.js, backend/package.json, backend/models/*.js, backend/routes/*.js içeriklerini yapıştır]

Bu kodu incele ve şu raporu çıkar:
1. Hangi best practice'ler uygulanmış? (✅ liste)
2. Hangi açıklar/eksikler var? (❌ liste, her biri için neden risk olduğunu açıkla)
3. Hangi endpoint'ler tamamlanmış, hangileri yarım?
4. Şema tasarımı sağlıklı mı? Eksik koleksiyon, yanlış ilişki var mı?
5. Güvenlik kontrolü: helmet, rate-limit, input validation, JWT secret, password hashing var mı?
6. Bu projeyi production'a götürmek için yapılması gereken 5 öncelikli iş ne?
```

**Doğrulama:** GitHub Issue olarak "Backend Denetim Raporu" açılmış, bulgular liste halinde, sorumlular atanmış.

---

## 0.4 — Tüm ekip lokalde çalıştırıyor mu?
**Sorumlu:** Tüm ekip
**Bitiş:** 10 May akşamı
**Ne demek:** Herkes tek tek `git pull` + `npm install` (hem backend hem client) + `npm run dev` yapıp çalışan bir ekran göstersin. **Burada takılan biri Faz 2'de panik yaşar.**

**Kontrol:** Discord/WhatsApp'a 6 ekran görüntüsü gelmiş.

---

# 🟦 FAZ 1 — Tasarım & API Sözleşmesi (11-13 Mayıs · 3 gün)

> **Amaç:** Bu fazdan sonra **API contract DONAR** — değişmez. Frontend ve backend artık birbirini beklemez.

---

## 1.1 — User story'leri netleştir
**Sorumlu:** Mehmet Furkan
**Bitiş:** 11 May
**Ne demek:** "Kullanıcı dolaba bakar, malzemeleri girer, sistem tarif önerir" gibi 12 senaryo yaz. Bunlar AI'a verilince kod hedef odaklı olur.

**AI Prompt:**
```
Akıllı Yemek Tarifi web uygulaması için 12 user story yaz. Format: "X kullanıcı olarak, Y yapabilmek istiyorum, çünkü Z."

Kapsanması gereken alanlar:
- Kayıt/giriş/şifremi unuttum
- Eldeki malzemelere göre tarif arama
- Kategori, süre, zorluk filtresi
- Tarif detayını görme (malzeme, adım, foto)
- Tarif favoriye ekleme/çıkarma
- Kişisel öneri ("sana özel" listesi)
- Profil sayfası
- Mobil cihazda kullanım

Her story'nin altına 2-3 madde "kabul kriteri" ekle (DoD).
docs/user-stories.md dosyasına yaz.
```

**Doğrulama:** `docs/user-stories.md` repo'da, ekibe okunduğunda "evet bunu yapacağız" deniyor.

---

## 1.2 — MongoDB şema tasarımı (final)
**Sorumlu:** Zehra
**Bitiş:** 12 May
**Ne demek:** Mevcut `models/` klasöründekileri tamamla. Eksik olanları ekle, yanlış olanları düzelt.

**AI Prompt:**
```
Mevcut /backend/models/ klasöründe şu dosyalar var: [içeriklerini yapıştır]

Aşağıdaki koleksiyonların eksiksiz Mongoose schema'larını yaz (TypeScript ile, mongoose 7+):

User: email (unique, required, lowercase, trim), password (hashed, required, select: false), name, dietaryPreferences[] (vegan/vegetarian/glutenFree etc), createdAt, updatedAt

Recipe: title (required), description, ingredients[{ name (required), amount, unit }], steps[String], cookTime (min, required), servings, category (enum), difficulty (enum: easy/medium/hard), imageUrl, createdBy (ref User), createdAt, updatedAt

Favorite: userId (ref User), recipeId (ref Recipe), createdAt — compound unique index (userId+recipeId)

MealPlan: userId (ref User), date, meals[{ mealType: enum(breakfast/lunch/dinner), recipeId: ref Recipe }], createdAt

Her şemada:
- timestamps: true
- gerekli validasyonlar (min/max length, regex email)
- index önerileri (Recipe.title text index, Recipe.ingredients.name index, Recipe.category, User.email unique)
- pre('save') hook ile User şemasında bcrypt password hashing
- methods.comparePassword User şemasında
- TypeScript interface'leri ile birlikte (IUser, IRecipe, vs)

Mevcut modellerle çakışma varsa hangisinin doğru olduğunu söyle.
```

**Doğrulama:** Tüm şemalar `models/` altında, MongoDB Compass'ta `npm run seed` sonrası yapı görünüyor.

---

## 1.3 — API contract (OpenAPI/Swagger) ⚠️ KRİTİK
**Sorumlu:** Mehmet Furkan + Ali
**Bitiş:** 13 May
**Ne demek:** **Tüm endpoint'lerin** URL, request, response shape'i yazılı dokuman. Bu bittikten sonra DEĞİŞMEZ.

**AI Prompt:**
```
Yukarıdaki Mongoose şemalarını kullanarak Akıllı Yemek Tarifi API'si için
OpenAPI 3.0 spec'i yaz. /docs/openapi.yaml dosyasına.

Endpoint'ler:

[Auth]
POST /auth/register   -> { email, password, name } -> 201 { user, token }
POST /auth/login      -> { email, password } -> 200 { user, token }
GET  /auth/me         -> 200 { user } (auth required)
POST /auth/logout     -> 204 (auth required)

[Recipes]
GET    /recipes              -> query: search, ingredient[], category, maxCookTime, page, limit
GET    /recipes/:id          -> 200 { recipe } | 404
POST   /recipes              -> auth, body: full recipe -> 201 { recipe }
PUT    /recipes/:id          -> auth + owner -> 200 { recipe }
DELETE /recipes/:id          -> auth + owner -> 204

[Favorites]
GET    /favorites            -> auth, 200 { recipes[] }
POST   /favorites/:recipeId  -> auth, 201 { favorite }
DELETE /favorites/:recipeId  -> auth, 204

[Recommendations]
POST /recommendations -> body: { ingredients: string[] }
                      -> 200 { recipes: [{ recipe, score (0-1), missingIngredients[] }] }

[Meal Plan]
GET  /meal-plans       -> auth, query: from, to dates -> 200 { plans[] }
POST /meal-plans       -> auth, body: { date, meals[] } -> 201
PUT  /meal-plans/:id   -> auth + owner -> 200
DELETE /meal-plans/:id -> auth + owner -> 204

Her endpoint için:
- Tüm request/response shape'leri (refs ile schemas section'da)
- Hata kodları: 400 (validation), 401 (no auth), 403 (forbidden), 404 (not found), 409 (conflict), 500
- Örnek payload (request + response)
- Description (1 cümle)

Sonunda Swagger UI'ı /api-docs route'una mount eden bir Express snippet'i de ver.
```

**Doğrulama:** `/api-docs` route'unda Swagger UI açılıyor, tüm endpoint'ler görünüyor. Bu doc DONDU — Faz 2'de değişmiyor.

---

## 1.4 — UI mockup (5 ana sayfa)
**Sorumlu:** Furkan Yılmaz
**Bitiş:** 13 May
**Ne demek:** Login, Anasayfa (arama), Tarif Detay, Profil, Öneri sayfalarının yapısı yazılı olsun. Figma şart değil — ASCII wireframe + component listesi yeterli.

**AI Prompt:**
```
Akıllı Yemek Tarifi uygulaması için 5 sayfanın ASCII wireframe + component listesini ver:

1. LoginPage / RegisterPage
2. HomePage: üst arama bar (malzeme chip + filtre), alt tarif kart grid
3. RecipeDetailPage: foto, malzemeler, adımlar, favorile butonu
4. ProfilePage: kullanıcı bilgisi, favoriler tab, mealplan tab
5. RecommendationPage: malzeme input chip + sonuç kart listesi

Her sayfa için:
- ASCII wireframe (basit kutu çizimi)
- Hangi component'ler kullanılacak
- Hangi API endpoint'i çağrılacak
- Hangi state tutulacak (local mi, global mi)
- Mobil görünümde ne değişiyor (sm: breakpoint)
- Loading + boş + hata state'leri için ne gösterilecek

docs/ui-spec.md dosyasına yaz.
```

**Doğrulama:** `docs/ui-spec.md` repo'da, Furkan Yılmaz her sayfayı 30 saniyede anlatabiliyor.

---

## 1.5 — React component hiyerarşisi
**Sorumlu:** Emre
**Bitiş:** 13 May
**Ne demek:** Hangi component'ler atomic, hangileri composite, state nerede.

**AI Prompt:**
```
Yukarıdaki UI spec'e göre React component hiyerarşisi öner:

/client/src/components/ui (atomic):
  - Button, Input, Card, Modal, Badge, Skeleton, Toast

/client/src/components/feature (composite):
  - RecipeCard, IngredientChipInput, SearchBar, FilterPanel, RecipeList,
    FavoriteToggle, ScoreBadge

/client/src/pages:
  - LoginPage, RegisterPage, HomePage, RecipeDetailPage,
    ProfilePage, RecommendationPage, MealPlanPage, NotFoundPage

/client/src/contexts:
  - AuthContext (user, token, login, logout, isAuthenticated)

/client/src/lib:
  - api.ts (axios instance, request interceptor JWT ekler)
  - queryClient.ts (TanStack Query config)
  - types.ts (API'den gelen tipler — OpenAPI'den türetilebilir)

/client/src/hooks:
  - useAuth, useRecipes, useFavorites, useRecommendations

State stratejisi:
- Auth global Context'te
- Server state TanStack Query'de (cache + auto-refetch)
- Form state react-hook-form'da
- UI state (modal, toast) component-lokal useState

Klasör yapısını dosya isimleriyle ver. Hangisini önce yazalım sırasını da belirt.
```

**Doğrulama:** Klasör yapısı `client/src/` altında oluşturulmuş, boş dosyalar var.

---

## 1.6 — Seed data script'i
**Sorumlu:** Zehra
**Bitiş:** 13 May
**Ne demek:** 30 örnek tarif, 5 kullanıcı, 10 favori. Boş DB ile UI test edemezsiniz.

**AI Prompt:**
```
MongoDB'ye Türk mutfağından 30 tarif, 5 kullanıcı, 10 favori, 5 mealplan
ekleyen bir seed script yaz: /backend/scripts/seed.ts

Tarifler çeşitli olsun:
- Kategoriler: kahvaltı, çorba, ana yemek, salata, tatlı, içecek
- Pişme süresi: 10-90 dk arası
- Zorluk: easy, medium, hard
- Gerçekçi malzemeler (domates, soğan, un, yumurta, peynir, tavuk göğsü, vb)
- Adım sayısı: 4-10
- Türkçe açıklamalar (menemen, mercimek çorbası, mantı, baklava, vb)

Kullanıcılar: 5 farklı dietaryPreference karışımıyla.

Script önce eski veriyi siler, sonra ekler.
package.json'a "seed": "ts-node scripts/seed.ts" ekle.

Çıktı format: konsola "✅ 30 recipe, 5 user, 10 favorite, 5 mealplan eklendi" yazsın.
```

**Doğrulama:** `npm run seed` çalışıyor, MongoDB Compass'ta veri görünüyor, anasayfada (Faz 2 sonunda) 30 tarif gözüküyor.

---

# 🟦 FAZ 2 — Çekirdek Özellikler (14-20 Mayıs · 7 gün)

> **Amaç:** Uçtan uca uygulama çalışıyor. Kayıt → arama → tarif aç → favorile → öneri al akışı sorunsuz.

> 🔧 **Her gün 17:00 entegrasyon kontrolü:** Sen (Mehmet Furkan) preview URL'ini açıp tüm akışı tıklarsın. Bozuk yer varsa o akşam pair ile çözülür.

---

## 2.1 — Auth API (kayıt, giriş, JWT)
**Sorumlu:** Ali
**Bitiş:** 15 May
**Ne demek:** `/auth/register` ve `/auth/login` endpoint'leri. Şifre bcrypt ile hash, JWT token, koruma middleware'i.

**AI Prompt:**
```
/backend altına Express + TS + Mongoose ile auth endpoint'leri yaz.
Mevcut User modelini kullan (Faz 1.2'de oluşturuldu).
OpenAPI spec'imizle birebir uyumlu (docs/openapi.yaml).

Dosyalar:
- /backend/routes/auth.routes.ts
- /backend/controllers/auth.controller.ts
- /backend/middleware/auth.middleware.ts
- /backend/lib/jwt.ts (sign + verify utility)
- /backend/lib/validation/auth.schema.ts (zod schemas)

Davranış:
POST /auth/register: zod validate, email lowercase + unique kontrol,
  bcrypt hash (10 round), user oluştur, JWT döndür, password'u response'tan çıkar.
POST /auth/login: zod validate, user bul (+select password),
  bcrypt.compare, JWT döndür.
GET /auth/me: middleware'den geçen userId'den user döndür.
POST /auth/logout: 204 (client side token siler).

Middleware: Authorization header'ından "Bearer <token>" al, JWT verify,
  req.userId set et, hata → 401.

Hatalar:
  400 zod validation
  401 invalid creds / no token / expired token
  409 email already exists

JWT_SECRET ve JWT_EXPIRES_IN env'den. expire 7 gün.

Sonunda postman collection veya REST Client (.http) dosyası örneği ver.
```

**Doğrulama:** Postman'da register → login → /auth/me sırası 200 OK. Yanlış şifrede 401. Aynı email tekrar kayıt 409.

---

## 2.2 — Tarif CRUD API
**Sorumlu:** Mehmet Furkan
**Bitiş:** 16 May
**Ne demek:** Tarif listele (filtre + sayfalama), tek tarif getir, oluştur, güncelle, sil.

**AI Prompt:**
```
/backend altına Recipe CRUD endpoint'leri yaz.
Mevcut Recipe modelini kullan, OpenAPI spec'iyle birebir uyumlu.

GET /recipes:
  query: search (string), ingredient (string[] — birden çok olabilir),
         category (string), maxCookTime (number), page (default 1), limit (default 12)
  search → MongoDB text search (Recipe.title text index)
  ingredient → Recipe.ingredients.name $in / $all (kullanıcı seçer)
  Response: { data: [...], meta: { total, page, totalPages, limit } }

GET /recipes/:id: tek tarif, populate createdBy (sadece name). 404 yoksa.

POST /recipes: auth required, zod validate, createdBy = req.userId.

PUT /recipes/:id: auth + sadece owner (createdBy === req.userId).
  Yoksa 403.

DELETE /recipes/:id: auth + sadece owner.

Dosyalar: /routes/recipes.routes.ts, /controllers/recipes.controller.ts,
  /lib/validation/recipe.schema.ts.

Tüm endpoint'ler errorHandler middleware'e düşsün, manuel try-catch yerine
  asyncHandler wrapper kullan.
```

**Doğrulama:** Postman'da seed verisinden listele, filtreyle ara, kendi oluşturduğun tarifi sil. Başkasının tarifini silmeye çalışınca 403.

---

## 2.3 — Favoriler & Öneri API
**Sorumlu:** Zehra
**Bitiş:** 18 May
**Ne demek:** Favori ekle/çıkar/listele + **kural tabanlı** öneri motoru (ML değil, basit eşleşme skoru).

**AI Prompt (Favoriler):**
```
/backend altına favorite endpoint'leri yaz:

GET /favorites: auth, kullanıcının favorilerini populate ile (recipe info dahil) döndür.
POST /favorites/:recipeId: auth, recipe var mı kontrol et, idempotent
  (tekrar eklemede 200 + mevcut favorite döndür, 409 değil — UX için).
DELETE /favorites/:recipeId: auth.

Compound unique index (userId + recipeId) modelden geliyor — duplicate
  insert MongoDB seviyesinde engellenir, hata yakala.

Dosyalar: /routes/favorites.routes.ts, /controllers/favorites.controller.ts.
```

**AI Prompt (Öneri):**
```
POST /recommendations endpoint'i yaz.
Body: { ingredients: string[] } - kullanıcının elindeki malzeme isimleri.

Algoritma (basit kural tabanlı, ML YOK):
1. Tüm Recipe'leri çek (cache değil, sadece v1 — gerekirse v2'de cache).
2. Her tarif için:
   matchedCount = tarifteki malzemelerden kullanıcıda olan sayısı
   (case-insensitive, trim)
   score = matchedCount / totalIngredientsInRecipe
3. score >= 0.5 olanları filtrele.
4. score'a göre azalan sırala.
5. İlk 10'unu döndür.

Response: {
  data: [{
    recipe: { ...recipe full },
    score: 0.0-1.0,
    matchedIngredients: string[],
    missingIngredients: string[]
  }]
}

Mantığı /services/recommendation.service.ts'e çıkar (controller'da değil).
Birim test örnekleri: /tests/recommendation.test.ts (Jest):
  - Boş input → boş sonuç
  - Eşleşmeyen malzemeler → boş sonuç
  - Kısmi eşleşme → doğru skor
  - Tam eşleşme → score 1.0
```

**Doğrulama:** `["domates", "soğan", "yumurta"]` gönder → menemen / omlet üstte, eksik malzemeleri yazıyor. Test'ler yeşil.

---

## 2.4 — Login/Register UI
**Sorumlu:** Emre
**Bitiş:** 15 May
**Ne demek:** İki sayfa, form validation, hata mesajları, başarılı login → token kaydetme + redirect.

**AI Prompt:**
```
/client/src/pages/auth/ altına LoginPage.tsx ve RegisterPage.tsx yaz.

Stack: React 18 + TS + Tailwind + react-hook-form + zod (form validation) +
  TanStack Query (mutation) + axios.

LoginPage:
- email + password input
- "Giriş Yap" butonu
- "Hesabın yok mu? Kayıt Ol" linki
- Validation: email format, password required
- Submit'te POST /auth/login mutation çağır
- Başarılıysa token'ı localStorage'a + AuthContext'e koy, /'a redirect
- Hata mesajı görünür (kart altında kırmızı yazı)
- Loading state buton üzerinde

RegisterPage:
- email, password, confirmPassword, name input
- Validation: email, password min 8 karakter ve 1 harf+1 rakam,
  confirmPassword eşleşmeli
- Submit'te POST /auth/register, başarılıysa otomatik login + redirect

AuthContext (/client/src/contexts/AuthContext.tsx):
- token, user, login(), logout(), isAuthenticated, isLoading
- Mount'ta localStorage'tan token oku → GET /auth/me ile user yükle
- Tüm API çağrılarına otomatik token header ekleyen axios interceptor

Tasarım: minimalist, tarif uygulamasına yakışır renkler (sıcak ton, yeşil-turuncu).
Mobil önce, sonra md: breakpoint'te center'lanmış kart.
```

**Doğrulama:** Browser'da register → otomatik login → / sayfası. Sayfa yenilense de session devam ediyor.

---

## 2.5 — Anasayfa (Arama + Tarif Listesi)
**Sorumlu:** Emre
**Bitiş:** 18 May
**Ne demek:** Üstte arama (malzeme chip + kategori + süre filtresi), altta tarif kart grid.

**AI Prompt:**
```
/client/src/pages/HomePage.tsx ve gerekli component'leri yaz.

Bileşenler:
- SearchBar (text input + ingredient chip input + category select + maxCookTime slider)
- FilterPanel (mobil için drawer, desktop için sidebar)
- RecipeCard (foto, başlık, kategori badge, süre, zorluk)
- RecipeGrid (mobil 1 sütun, sm: 2, md: 3, lg: 4)
- LoadMoreButton (sayfalama: page state, "Daha fazla yükle" butonu)
- EmptyState (eşleşme yoksa "tarif bulunamadı" + öneri)

Davranış:
- Filtre değişince useRecipes hook (TanStack Query) GET /recipes çağırır
- Debounce text input 300ms
- URL query param'larla senkron (kullanıcı linki paylaşabilsin)
- Loading skeleton, hata mesajı

Kart tıklanınca /recipe/:id'ye route.

useRecipes hook'u /client/src/hooks/useRecipes.ts'de.
```

**Doğrulama:** Anasayfada 30 seed tarifi. "domates" yaz → menemen üstte. Kategori filtrele → uygun tarifler. Mobile'da grid 1 sütun.

---

## 2.6 — Tarif Detay + Favori
**Sorumlu:** Furkan Yılmaz
**Bitiş:** 17 May
**Ne demek:** /recipe/:id sayfası — tarif detayı + favori toggle.

**AI Prompt:**
```
/client/src/pages/RecipeDetailPage.tsx yaz.

Route: /recipe/:id, useParams ile id al.
Veri: useRecipe(id) hook (TanStack Query, GET /recipes/:id).

UI:
- Hero: foto (geniş), üstte başlık + favori toggle (kalp ikonu)
- Meta: kategori badge, süre, zorluk, yapan
- Malzeme listesi (sol kolon desktop'ta)
- Adım adım tarif (sağ kolon, numaralı)
- Mobile'da tek kolon stack

Favori toggle:
- Login değilse buton disabled, hover'da "giriş yap" tooltip
- Login ise: kalp dolu/boş kullanıcının favorisinde mi?
- Tıklayınca POST/DELETE /favorites/:recipeId mutation
- Optimistic update (önce UI, sonra API)
- Hata olursa rollback + toast

Loading skeleton, 404 sayfası ayrı component.
```

**Doğrulama:** Anasayfadan tarif tıkla → detay açılır → favorile → /profile'ta favoriler arasında.

---

## 2.7 — Profil + Öneri Sayfası
**Sorumlu:** Furkan Yılmaz
**Bitiş:** 19 May
**Ne demek:** Profil = kullanıcı bilgi + favori liste. Öneri = malzeme gir + sonuç kart listesi.

**AI Prompt (Profil):**
```
/client/src/pages/ProfilePage.tsx yaz.

Sekmeler (tab UI):
1. "Bilgilerim" — email, name (readonly v1), dietaryPreferences (multiselect chip)
2. "Favorilerim" — useFavorites hook'tan favori liste, RecipeCard grid
3. "Yemek Planım" — v2 için placeholder (sonra yapılacak)

Auth zorunlu: AuthContext'te user yoksa /login'e redirect (ProtectedRoute pattern'i).
```

**AI Prompt (Öneri):**
```
/client/src/pages/RecommendationPage.tsx yaz.

UI:
- Üst: "Elindeki malzemeleri yaz, sana ne yapabileceğini önerelim"
- IngredientChipInput: yazıp Enter ile chip ekle, çarpı ile sil
- "Öneri Al" butonu
- Sonuç altında: her tarif için RecipeCard + score yüzdesi (örn "%80 eşleşti") +
  "Eksik: yumurta, un" küçük yazı

Davranış:
- Buton tıklanınca POST /recommendations mutation
- Boş input → buton disabled
- Boş sonuç → "maalesef eşleşme bulunamadı, daha fazla malzeme ekle" mesajı
- Loading: skeleton kartlar
```

**Doğrulama:** "domates, soğan, yumurta" gir → menemen %100 eşleşmiş, omlet %80, eksikler yazılı.

---

## 2.8 — Logging + Hata izleme
**Sorumlu:** Hanifi
**Bitiş:** 18 May
**Ne demek:** Backend'e log altyapısı + Sentry (free tier).

**AI Prompt:**
```
/backend'e pino logger entegre et:
- /backend/lib/logger.ts: pino instance
- Dev'de pretty print (debug+), prod'da JSON (info+)
- Log level env'den (LOG_LEVEL)
- HTTP middleware: her isteğe için method, url, status, duration, userId log'la
  (pino-http kullanabilirsin)
- console.log kullanımı yasak — bul ve değiştir.

Sonra Sentry SDK ekle (@sentry/node):
- /backend/lib/sentry.ts: init
- Server.ts başında Sentry.init({ dsn: env.SENTRY_DSN })
- errorHandler middleware'inde Sentry.captureException(err)
- Sadece NODE_ENV=production'da aktif, dev'de devre dışı

Frontend Sentry de ekle (@sentry/react):
- /client/src/lib/sentry.ts
- ErrorBoundary ile sarmalama
- Sadece prod'da aktif

env.example'a SENTRY_DSN_BACKEND, VITE_SENTRY_DSN_FRONTEND ekle.
```

**Doğrulama:** Konsola istek log'ları akıyor. Bilinçli hata fırlat → Sentry dashboard'unda görünüyor.

---

## 2.9 — Preview deploy
**Sorumlu:** Hanifi
**Bitiş:** 19 May
**Ne demek:** `develop` branch'i her merge'de otomatik canlıya çıksın.

**AI Prompt:**
```
Bu projeyi ücretsiz tier'larla deploy etmek için adım adım rehber yaz:
- Frontend: Vercel (otomatik develop branch deploy)
- Backend: Railway veya Render (otomatik develop branch deploy)
- DB: MongoDB Atlas free tier (M0)

Her servis için:
1. Hesap açma + projeyi bağlama
2. Env değişkenlerini ayarlama (production değerleriyle)
3. Build ve start komutları
4. Domain alma (vercel.app subdomain yeterli)
5. CORS ayarları (backend'in client URL'ini whitelist'e alması)

Adımları docs/deploy.md'ye yaz. Bir kontrol listesi formatında.

Ayrıca .github/workflows/ci.yml ekle:
- PR'larda lint + typecheck + test çalışsın
- Failure'da merge engellensin

CI çalışan bir setup için minimum gerekenler.
```

**Doğrulama:** `develop`'a push → 5dk içinde public URL canlı. CI badge yeşil.

---

## 2.10 — Günlük entegrasyon kontrolü
**Sorumlu:** Mehmet Furkan
**Bitiş:** Her gün 17:00
**Ne demek:** Sen olarak preview URL'ini açıp uçtan uca akışı tıklarsın: register → login → arama → tarif aç → favorile → öneri al. Bozukluk varsa GitHub Issue + sorumluyu etiketle.

---

# 🟦 FAZ 3 — QA, Mobil & Güvenlik (21-25 Mayıs · 5 gün)

> **Amaç:** Çalışıyor → kaliteli ve güvenli çalışıyor.

---

## 3.1 — Mobil responsive
**Sorumlu:** Furkan Yılmaz
**Bitiş:** 23 May
**Ne demek:** Tüm sayfalar telefonda düzgün. Tailwind breakpoint'leri ile.

**AI Prompt:**
```
Aşağıdaki React component'i mobil uyumlu hale getir: [bileşen kodunu yapıştır]

Kurallar:
- Mobile-first: önce mobil stilleri, sonra sm:/md:/lg: ile büyüt
- Touch target minimum 44px
- Hamburger menu mobile'da, full nav desktop'ta
- Horizontal scroll YOK
- Font size minimum 14px mobile'da
- Tablet (md:) ve desktop (lg:) için ayrı breakpoint'ler

Test: Chrome DevTools'ta iPhone 12 (390x844), iPad (768x1024),
Desktop (1440x900) preset'lerinde kontrol et.
```

**Doğrulama:** 5 sayfanın her biri 3 ekran boyutunda düzgün.

---

## 3.2 — API entegrasyon testleri
**Sorumlu:** Mehmet Furkan
**Bitiş:** 22 May
**Ne demek:** Önemli endpoint'ler için Jest + supertest.

**AI Prompt:**
```
/backend/__tests__/ altına Jest + supertest entegrasyon testleri yaz.

Setup:
- mongodb-memory-server (in-memory test DB)
- jest.setup.ts: her test öncesi DB temizle, seed minimal data
- jest.config.ts: ts-jest preset

Test edilecek endpoint'ler:
- POST /auth/register: happy path, duplicate email, invalid input
- POST /auth/login: happy, wrong password, no user
- GET /auth/me: with token, without token (401)
- GET /recipes: empty, with filters, pagination
- POST /recipes: auth, owner check
- POST /recommendations: empty input, valid input, score check

Coverage hedefi: %70+. CI'a bağla (.github/workflows/ci.yml).
```

**Doğrulama:** `npm test` yeşil. CI'da da yeşil.

---

## 3.3 — Güvenlik checklist (OWASP Top 10)
**Sorumlu:** Ali
**Bitiş:** 23 May
**Ne demek:** En sık güvenlik hatalarını tara + düzelt.

**AI Prompt:**
```
Aşağıdaki Express + Mongoose backend'inde OWASP Top 10 açıklarını ara ve düzelt:

[Tüm /backend kodunu yapıştır]

Checklist:
1. Injection: input validation (zod) tüm endpoint'lerde var mı?
2. Broken auth: JWT secret 32+ karakter, expire var, password policy?
3. Sensitive data: password log'lara/response'a düşüyor mu?
4. XSS: kullanıcı girdisi nasıl render ediliyor (dangerouslySetInnerHTML var mı)?
5. CSRF: token tabanlı (header'da JWT) mı, cookie tabanlı mı?
6. Rate limiting: auth endpoint'lerinde brute force koruması (express-rate-limit)?
7. helmet middleware ekli mi?
8. CORS doğru kısıtlanmış mı (whitelist origin)?
9. Dependency'lerde npm audit açığı var mı?
10. Hata mesajlarında stack trace dışarı sızıyor mu (sadece prod'da gizle)?
11. .env dosyaları gitignore'da mı?
12. MongoDB queries injection-safe mi (raw $where yok mu)?

Her madde için: bulduğun açık + yapılacak düzeltme + kod örneği.
docs/security-audit.md'ye rapor olarak yaz.
```

**Doğrulama:** Rapor docs'ta. Tüm maddeler ✅. `npm audit` temiz.

---

## 3.4 — DB index + performans
**Sorumlu:** Zehra
**Bitiş:** 24 May
**Ne demek:** Yavaş sorgulara index, N+1 problemi var mı kontrol.

**AI Prompt:**
```
Aşağıdaki Mongoose şemaları + sık kullanılan sorgular için index önerileri yap:

[şemaları + örnek sorguları yapıştır]

İncelemeler:
- Recipe.title text index var mı?
- Recipe.ingredients.name index var mı (öneri motorunda kritik)?
- Recipe.category, Recipe.cookTime index?
- User.email unique index?
- Favorite (userId, recipeId) compound unique?

Migration script: /backend/scripts/createIndexes.ts

Ayrıca öneri motorunu (/services/recommendation.service.ts) optimize et:
- Şu an her istek tüm tarifleri çekiyor → 1000 tarifte yavaşlar
- Kullanıcı malzemelerinden en az birini içeren tarifleri çekecek şekilde
  query'yi daralt ($in ile)
- Sonra in-memory'de skor hesabı

Performans testi: 100 tarif için /recommendations endpoint'i p95 <500ms
olmalı (k6 ile basit load test örneği de ver).
```

**Doğrulama:** Anasayfa ve öneri 500ms altında. Index'ler MongoDB'de var.

---

## 3.5 — Bug bash günü
**Sorumlu:** Tüm ekip
**Bitiş:** 25 May
**Ne demek:** 1 gün herkes uygulamayı kullanıcı gibi kullanıp bug bulur.

**Yöntem:**
- 10:00-11:00: herkes 1 saat tıklayıp not alır (mobil + desktop)
- 11:00-12:00: bulunanlar GitHub Issues'a açılır, etiket: P0 (blocker), P1 (ciddi), P2 (nice-to-have)
- 13:00-17:00: P0 ve P1'ler düzeltilir
- 17:00: tekrar uçtan uca check

---

# 🟦 FAZ 4 — Cila & Teslim (26-29 Mayıs · 4 gün)

---

## 4.1 — Erişilebilirlik temel kontrolü
**Sorumlu:** Emre
**Bitiş:** 26 May
**Ne demek:** Renk kontrastı, alt-text, klavye navigasyonu, focus ring.

**AI Prompt:**
```
React app'te WCAG 2.1 AA seviyesi temel kontrolleri yap:
- Tüm img'lerde alt prop var mı?
- Buton/link arasındaki ayrım doğru mu (semantic HTML)?
- Color contrast minimum 4.5:1 (text), 3:1 (UI elements)
- Form input'larında label var mı, aria-label?
- Modal'larda focus trap, Escape ile kapanma?
- Skip-to-content linki var mı?

Sayfa sayfa rapor + düzeltme öner. Eksenten otomatize için axe-core /
@axe-core/react ekle, dev modda console'a uyarı bassın.
```

**Doğrulama:** Chrome Lighthouse Accessibility score ≥90.

---

## 4.2 — UI son cilası
**Sorumlu:** Furkan Yılmaz
**Bitiş:** 26 May
**Ne demek:** Hizalama, loading state, animasyon, boş durum mesajları, 404 sayfası.

---

## 4.3 — Production deploy
**Sorumlu:** Hanifi
**Bitiş:** 28 May
**Ne demek:** `main` branch → production environment.

**AI Prompt:**
```
Mevcut develop deploy'unu production'a kopyala. Production-spesifik ayarlar:
- main branch otomatik deploy (Vercel + Railway)
- Ayrı MongoDB Atlas cluster (production)
- Sentry production project
- Log seviyesi info+
- CORS sadece production frontend URL'ini whitelist
- Health check endpoint'i (GET /api/health)
- Uptime Robot'ta health check ücretsiz monitor
- Frontend için custom domain bağlama opsiyonel

docs/deploy.md'ye production bölümü ekle.
```

**Doğrulama:** main'e push → 5dk → prod URL canlı + health endpoint OK.

---

## 4.4 — README + dokümantasyon
**Sorumlu:** Furkan Yılmaz
**Bitiş:** 27 May

**AI Prompt:**
```
Projenin README.md'sini güncelle. İçerik:
1. Proje tanımı (1 paragraf)
2. Demo URL + ekran görüntüleri (3-4 tane)
3. Özellikler (madde madde, emoji ile)
4. Tech Stack
5. Yerel kurulum (Backend + Frontend ayrı ayrı)
6. Env değişkenleri tablosu
7. Available scripts (dev, build, test, seed)
8. API dokümantasyonu (Swagger UI link)
9. Klasör yapısı (3 seviye)
10. Ekip + roller
11. Lisans (MIT)

Profesyonel görünüm: badge'ler (build status, license), TOC, horizontal rule'lar.
```

**Doğrulama:** GitHub'da README güzel görünüyor. Yeni biri girse adım adım çalıştırabilir.

---

## 4.5 — Sunum hazırlığı
**Sorumlu:** Mehmet Furkan + Zehra
**Bitiş:** 28 May
**Ne demek:** 10 dakikalık sunum + canlı demo.

**Yapı:**
1. Problem (1 dk) — neden bu uygulama?
2. Çözüm + canlı demo (5 dk) — en güzel akışı tıkla
3. Mimari (1 dk) — basit blok diyagram
4. AI ile geliştirme süreci (1 dk) — bu projenin özgün hikayesi, jüriye ilginç gelir
5. Zorluklar + öğrenilenler (1 dk)
6. Sorular (1 dk)

**AI Prompt:**
```
Akıllı Yemek Tarifi web uygulaması bitirme sunumu için 10 slayt taslağı yaz
(markdown formatında, sonra Powerpoint/Slides'a çevirilecek).

Hedef: 10 dakika sunum, jüri yazılım mühendisi hocalar.
6 başlığı kapsa (yukarıdaki yapı).

Her slaytta:
- Başlık
- 3-5 madde (bullet)
- Konuşmacı notu (sözel olarak ne diyeceğim)

"AI ile geliştirme süreci" bölümünde özellikle:
- iyi prompt yazmanın önemi (4 parça: bağlam, görev, kabul, kısıt)
- contract-first yaklaşımı (API spec donduktan sonra paralel çalışma)
- günlük entegrasyon kuralı
- pair çalışmanın AI çıktısının kalitesini nasıl artırdığı
- nelerde AI'ın yetmediği (debug, mimari karar, ürün vizyonu)
```

---

## 4.6 — Demo provası
**Sorumlu:** Tüm ekip
**Bitiş:** 28 May akşam
**Ne demek:** 2 kez baştan sona sunumu yap. Plan B: lokal video kaydı hazır (internet kesilse bile).

---

## 4.7 — Final teslim & sunum
**Tarih:** 29 May ✅

---

# 🎯 PM (Mehmet Furkan) Günlük Rutini

## Her sabah 09:30 (15dk)
- Discord/WhatsApp'ta herkesten "bugün ne yapacağım + blocker var mı?" mesajı al
- Blocker'ları GitHub Issue'a aç + sorumluyu etiketle

## Her akşam 17:00 (30dk)
- Preview URL'ini aç, uçtan uca akışı tıkla:
  1. Yeni kullanıcı kaydı
  2. Login
  3. Anasayfa arama (text + filtre)
  4. Tarif detay açma
  5. Favorile / favoriden çıkar
  6. Öneri sayfasında malzeme gir, sonuç al
  7. Profil sayfasında favoriler görünüyor mu
  8. Mobil ekranda her şey düzgün mü
- Hatalı yer varsa GitHub Issue + ekibe duyuru
- Discord'a günlük özet at: "✅ entegrasyon OK" veya "⚠️ X hatası var, Y sorumlu"

## Her Cumartesi (1 saat)
- Faz hedefleri tutuyor mu?
- Tutmuyorsa kapsam kıs:
  - Öneri motorunu daha basitleştir
  - Mealplan özelliğini v2'ye at
  - Mobil polish'i azalt

---

# ⚠️ Risk ve Erken Uyarı Sinyalleri

| Sinyal | Ne yap |
|---|---|
| AI yazdığı kodu kimse anlayamıyor | Pair'le 2 kişi otursun, AI'a "açıkla bunu" dedirt, gerekirse parçalayıp tekrar yazdır |
| Aynı dosyada 3 kişi çakışıyor | Daha küçük dosya/component'lere böl. Modülariteyi artır |
| Faz 2'nin yarısında bir özellik yetişmiyor | **O özelliği kapsam dışına al** — yarım yamalak teslim etmektense vazgeç |
| Frontend ↔ backend "şu alan adı ne?" tartışması | API contract'a tekrar dön, oradan referans al. Doc kazanır, kişi değil |
| AI kodu local'de çalışıyor ama deploy'da hata | Env değişkenlerini ve build script'ini kontrol et, deploy log'larını oku |
| Bir ekip üyesi 2 gündür ortada yok | Hemen ara, yedeklemeye al (pair'i devralabilir) |

---

# 📚 Faydalı Linkler

- [OpenAPI Spec](https://swagger.io/specification/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)

---

> **Bu plan canlı bir dokümandır.** Faz sonlarında ekiple birlikte revize edin. Tutmayan tahminleri olduğu gibi kabul edin, kapsamı kısın, asla ekibi sıkıştırmayın.

> **Son söz:** AI hızlı ama dikkatsiz. Sizin işiniz onu yönlendirmek, kontrol etmek, anlamak. Yazılan her satırı en az 2 kişi okumalı. Anlamadığınız kodu merge etmeyin — üretkenliği geçici olarak yavaşlatır ama bug'ı geç fark etmek faciaya çıkar.

**Başarılar! 🚀**
