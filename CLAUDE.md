# CLAUDE.md — Proje Kuralları

> 📌 **Bu dosya AI agent'ları için yazılmıştır.** Antigravity, Claude Code, Cursor, Copilot ve benzer her AI bu dosyayı okur ve buradaki kurallara uyarak kod yazar. Yeni bir agent görevi başlatırken bu dosyayı bağlam olarak ver.

> ⚠️ **NOT:** Bu dosya mevcut kod tabanına göre uyarlanmıştır (11 May 2026 backend denetim raporu sonrası). Mevcut kuralları zorla değiştirme — yeni özellikler yazarken bu pattern'lere uyum sağla.

---

## 📌 Proje Hakkında

- **İsim:** Akıllı Yemek Tarifi Web Uygulaması ("Night Code Kitchen")
- **Amaç:** Kullanıcıların elindeki malzemelere göre tarif öneren, kişiselleştirilmiş yemek planı oluşturabilen web app
- **Ekip:** 6 kişilik 1. sınıf yazılım mühendisliği öğrencisi
- **Geliştirme yöntemi:** AI agent destekli (Antigravity + Opus 4.6)
- **Süre:** 8-28 Mayıs 2026 (20 gün)

---

## 🛠 Tech Stack

| Katman | Teknoloji |
|---|---|
| **Backend (mevcut)** | Node.js, Express 4, **JavaScript (ES Modules veya CommonJS — mevcut kod neyse o)**, Mongoose 7, jsonwebtoken, bcryptjs, dotenv, cors |
| **Backend (Faz 2'de eklenecek)** | helmet, express-rate-limit, zod, morgan + winston (veya pino) |
| **Frontend (yeni yazılacak)** | React 18, **TypeScript**, Vite, Tailwind CSS, React Router v6, TanStack Query, react-hook-form, zod, axios |
| **Database** | MongoDB 7 |
| **Backend Test** | Jest + supertest + mongodb-memory-server |
| **Frontend Test** | Vitest + Testing Library + MSW |
| **Deploy** | Vercel (frontend), Railway (backend), MongoDB Atlas (DB) |

> **Neden backend JS, frontend TS?** Backend'de zaten 47 commit'lik JS kod var, dönüştürmek 20 günlük takvimde mantıksız. Frontend sıfırdan yazılacak — TS'in derleme-zamanı tip güvenliği AI üretkenliğine değer katar.

> Yeni bağımlılık eklemeden önce mevcut listede karşılığı var mı kontrol et. PR'da gerekçe yaz.

---

## 📁 Klasör Yapısı

```
/
├── backend/                         # Express server (JavaScript)
│   ├── config/
│   │   └── db.js                    # MongoDB bağlantısı
│   ├── controllers/                 # HTTP handler'lar
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── recipeController.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # protect (JWT doğrulama)
│   │   ├── errorMiddleware.js       # merkezi hata yönetimi
│   │   └── validate.js              # (Faz 2'de eklenecek — zod)
│   ├── models/                      # Mongoose şemaları
│   │   ├── User.js
│   │   ├── Recipe.js
│   │   └── Favorite.js              # (Faz 2'de eklenecek)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── recipeRoutes.js
│   ├── utils/                       # asyncHandler, jwt yardımcıları
│   ├── scripts/
│   │   └── seed.js                  # (Faz 1'de eklenecek)
│   ├── tests/                       # (Faz 3'te eklenecek)
│   ├── .env                         # ⚠️ GIT'E GİRMEZ
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                    # entry point
│
├── client/                          # React frontend (TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Button, Input, Card (atomic)
│   │   │   └── feature/             # RecipeCard, SearchBar (composite)
│   │   ├── pages/                   # LoginPage, HomePage, ...
│   │   ├── contexts/                # AuthContext
│   │   ├── hooks/                   # useAuth, useRecipes, useFavorites
│   │   ├── lib/                     # api.ts (axios), queryClient.ts, env.ts
│   │   ├── types/                   # API response tipleri
│   │   ├── utils/
│   │   └── main.tsx
│   ├── .env.example                 # VITE_API_URL=...
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│   ├── openapi.yaml                 # ⚠️ API SÖZLEŞMESİ — TEK BAŞINA DEĞİŞTİRME
│   ├── user-stories.md
│   ├── ui-spec.md
│   └── deploy.md
│
├── .github/
│   └── workflows/
│       └── ci.yml                   # lint + test
│
├── docker-compose.yml               # local dev: MongoDB + backend + client
├── README.md
└── CLAUDE.md                        # ← bu dosya
```

**Yeni klasör eklerken:** Mevcut yapıya uy. Yeni "geçici" klasör açma. Belirsizse mevcut bir klasör altına sok.

---

## 🔤 Naming Convention

### Backend (JavaScript)

| Tip | Stil | Örnek |
|---|---|---|
| Model dosyası | `PascalCase.js` | `User.js`, `Recipe.js` |
| Controller dosyası | `camelCase` + `Controller.js` | `authController.js`, `recipeController.js` |
| Middleware dosyası | `camelCase` + `Middleware.js` veya açıklayıcı isim | `authMiddleware.js`, `errorMiddleware.js` |
| Route dosyası | `camelCase` + `Routes.js` | `authRoutes.js`, `recipeRoutes.js` |
| Utility dosyası | `camelCase.js` | `generateToken.js`, `asyncHandler.js` |
| Fonksiyon / değişken | `camelCase` | `getUserById`, `cookTime`, `isAuthenticated` |
| Sabit | `UPPER_SNAKE_CASE` | `MAX_LOGIN_ATTEMPTS`, `DEFAULT_PAGE_SIZE` |

### Frontend (TypeScript)

| Tip | Stil | Örnek |
|---|---|---|
| React component dosyası | `PascalCase.tsx` | `RecipeCard.tsx`, `LoginPage.tsx` |
| Hook dosyası | `useXxx.ts` (camelCase) | `useAuth.ts`, `useRecipes.ts` |
| Utility dosyası | `camelCase.ts` | `formatDate.ts`, `api.ts` |
| TypeScript interface / type | `PascalCase` | `User`, `RecipeResponse` |

### Ortak

| Tip | Stil | Örnek |
|---|---|---|
| Env değişkeni | `UPPER_SNAKE_CASE` | `MONGO_URI`, `JWT_SECRET` |
| MongoDB koleksiyon | lowercase, çoğul | `users`, `recipes` |
| API route | kebab-case, çoğul | `/api/recipes`, `/api/meal-plans` |
| API prefix | Tüm route'lar `/api/...` | `/api/auth/login` |

**İsim seçim kuralı:** İsim, ne yaptığını/ne tuttuğunu anlatmalı. `data`, `temp`, `obj`, `x`, `arr` gibi belirsiz isimler **YASAK**.

---

## ⚡ Async / Await Zorunlu

`Promise.then()` chain **YASAK**. Tüm async kod async/await ile yazılır.

```javascript
// ❌ YASAK
function loadUser() {
  return fetch('/api/user')
    .then(res => res.json())
    .then(data => setUser(data))
    .catch(err => console.error(err));
}

// ✅ DOĞRU
async function loadUser() {
  try {
    const res = await fetch('/api/user');
    const data = await res.json();
    setUser(data);
  } catch (err) {
    logger.error('Failed to load user', err);
  }
}
```

Tek istisna: `.catch()` veya `.finally()` zincirinin **tek kullanımı** (örn TanStack Query mutation handler'ı).

---

## 🚨 Hata Yönetimi (Backend)

Proje **merkezi `errorMiddleware.js`** kullanıyor. Kontrolöllerden hata `throw` veya `next(err)` ile geçer, middleware yakalar ve formatlar.

### 1. Kontrolöllerde hata fırlatma

Yeni controller yazarken aşağıdaki pattern'i kullan:

```javascript
// controllers/recipeController.js
import asyncHandler from 'express-async-handler';
import Recipe from '../models/Recipe.js';

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
export const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate('author', 'name');

  if (!recipe) {
    res.status(404);
    throw new Error('Tarif bulunamadı');
  }

  res.json({ success: true, data: recipe });
});
```

> **`express-async-handler`:** Manuel try/catch'ten kurtarır. `npm i express-async-handler`. Çoğu MERN tutorial'da kullanılır.

### 2. errorMiddleware.js (mevcut)

Mevcut middleware:
- `CastError` (geçersiz ObjectId) → 404
- `ValidationError` (Mongoose validation) → 400
- DuplicateKey (E11000) → 400 "Bu kayıt zaten var"
- Genel hata → 500 (prod'da stack trace gizli)

> **Genişletilebilir:** Yeni custom error tipleri eklenecekse, errorMiddleware'i güncellemeden önce ekiple konuş.

### 3. ❌ YASAK pattern'ler

```javascript
// ❌ Manuel try/catch route'ta
router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Hata yutma
try { ... } catch (err) { /* sessiz */ }

// ❌ console.error yapıp devam etme
try { ... } catch (err) { console.error(err); res.json({}); }
```

```javascript
// ✅ DOĞRU
router.get('/recipes/:id', getRecipeById);  // asyncHandler içeride
```

---

## ✅ Validation

### Mevcut durum
Sadece **Mongoose validation** var (`required`, `minlength`, `enum`, `match`). Body'den gelen ekstra/zararlı alanlar süzülmüyor.

### Hedef (Faz 2'de eklenecek)
Her endpoint'in `body`, `query` ve `params`'ı **zod ile validate** edilir.

```javascript
// lib/validation/auth.schema.js
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'En az 8 karakter')
    .regex(/[A-Za-z]/, 'En az bir harf')
    .regex(/\d/, 'En az bir rakam'),
  name: z.string().min(2).max(50).trim()
});
```

```javascript
// middleware/validate.js
export const validateBody = (schema) => (req, _res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    res.status(400);
    next(err);  // errorMiddleware yakalayacak
  }
};
```

```javascript
// route'ta kullanım
router.post('/register', validateBody(registerSchema), registerUser);
```

**Frontend'de de zod kullan** — react-hook-form ile birlikte.

---

## 📦 Response Shape Standardı

Mevcut kod **`{ success, data }` / `{ success, message }`** formatını kullanıyor. **Bu standart kalıyor.**

### Başarı

```json
{ "success": true, "data": { ... } }
```

Liste:
```json
{ "success": true, "data": [ ... ] }
```

Sayfalama varsa:
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": { "total": 145, "page": 2, "totalPages": 13, "limit": 12 }
}
```

### Hata (errorMiddleware tarafından otomatik formatlanır)

```json
{
  "success": false,
  "message": "Tarif bulunamadı"
}
```

Geliştirme modunda ek olarak `stack` da döner.

> **Hem `data` hem `message` aynı response'ta YOK.** Ya success+data ya success:false+message.

---

## 🔒 Güvenlik Kuralları

### 1. Password asla response'a / log'a koyma

`User.password` field'ı `select: false`. Manuel `select('+password')` sadece login için yapılır:

```javascript
// ✅ DOĞRU
const user = await User.findOne({ email }).select('+password');
if (!user || !(await user.matchPassword(password))) {
  res.status(401);
  throw new Error('Geçersiz email veya şifre');
}

res.json({
  success: true,
  data: {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  }
});
// ⚠️ password ASLA response'a koyulmaz, log'a yazılmaz
```

### 2. Env değişkenleri

**Mevcut env değişkenleri (`.env.example`):**

```
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/nightcodekitchen
JWT_SECRET=                # ⚠️ EN AZ 64 KARAKTER RASTGELE
JWT_EXPIRE=30d
```

**Faz 2'de eklenecek:**

```
CLIENT_URL=http://localhost:5173       # CORS için
LOG_LEVEL=info                         # debug | info | warn | error
SENTRY_DSN=                            # production'da hata izleme (opsiyonel)
```

**Yeni env değişkeni eklediğinde:**
1. `.env.example`'a örneği ekle (gerçek değer değil — placeholder)
2. `README.md` env tablosunu güncelle
3. Backend'de validate et:

```javascript
// config/validateEnv.js (Faz 2'de eklenecek)
const required = ['NODE_ENV', 'PORT', 'MONGO_URI', 'JWT_SECRET', 'JWT_EXPIRE'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env: ${key}`);
  }
}
if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
}
```

**`process.env.X` doğrudan kullanımı şimdilik kabul** (mevcut kod öyle). Faz 2'de tek noktadan validate edilecek.

### 3. JWT_SECRET güçlü olmalı

**ASLA:**
- `night_code_kitchen_super_secret_key_2026` gibi tahmin edilebilir string
- Kısa (< 32 karakter)
- Production'da development değeriyle aynı

**Üretmek için:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Bu çıktıyı **sadece `.env`** dosyasına yaz, **`.env.example`'a değil** (orada placeholder kalır).

### 4. Hardcoded secret YASAK

JWT_SECRET, API key, DB password kodda asla. **Sadece env'de.** `.env` dosyası `.gitignore`'da (✅ mevcut), `.env.example` repo'da.

### 5. Faz 2'de zorunlu olacak güvenlik middleware'leri

`server.js`'e eklenecek:

```javascript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());

app.use(express.json({ limit: '10kb' }));  // body size sınırı

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 dk
  max: 10,                    // IP başına 10 istek
  message: { success: false, message: 'Çok fazla deneme. Lütfen biraz bekleyin.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

### 6. Input sanitization

Kullanıcıdan gelen string'leri MongoDB query'sinde RAW kullanma. Zod validate edip string olarak almak şart:

```javascript
// ❌ YASAK — NoSQL injection açığı
User.find({ email: req.body.email });  // body parse edilmemişse {$gt: ''} gibi gelebilir

// ✅ DOĞRU — zod validate ettikten sonra
const { email } = registerSchema.parse(req.body);  // string garantili
User.find({ email });
```

`$where`, raw query string, `eval` **YASAK**.

### 7. CORS konfigürasyonu

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

Production'da `*` (wildcard) YASAK. Sadece spesifik origin.

---

## 📝 Logging

### Mevcut durum
**Hiç logger yok.** `console.log` her yerde kullanılabilir görünüyor.

### Hedef (Faz 2'de eklenecek)

**HTTP istek logları için `morgan`:**
```javascript
import morgan from 'morgan';
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

**Uygulama logları için `winston` (veya `pino`):**
```javascript
// utils/logger.js
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'development'
        ? winston.format.combine(winston.format.colorize(), winston.format.simple())
        : winston.format.json()
    })
  ]
});
```

Kullanım:
```javascript
import { logger } from '../utils/logger.js';

// ❌
console.log('User logged in', user.email);

// ✅
logger.info('User logged in', { userId: user._id });
logger.error('Login failed', { err: err.message, path: req.path });
```

**Log'a hassas veri yazma:** password, JWT token, bcrypt hash, kredi kartı, kişisel veri.

**Frontend'de `console.log` debug için kullanılabilir ama commit'lemeden sil.** Production'a `console.log` sızması yasak.

---

## 🌳 Git & Commit Format

### Branch stratejisi

- `main` → production (otomatik prod deploy)
- `develop` → staging (otomatik preview deploy) — ❗ henüz açılmadı, açılmalı
- `feature/<isim>` → yeni özellik (örn `feature/auth-login`, `feature/recipe-search`)
- `fix/<isim>` → bug fix
- `docs/<isim>` → sadece dokümantasyon

> **Şu an mevcut:** Kişi adıyla branch'ler (Mehmet-Furkan, Emre-Cansever, vs). Bundan sonraki feature'lar **mutlaka `feature/<is>`** ismiyle açılsın — kişi-branch'i mantığı geçmiş tartışılmaz hale getirir.

`main` ve `develop`'a **doğrudan push YASAK**. PR zorunlu, en az 1 review.

> ⚠️ **Şu an branch protection açık değil** — PM'in (Mehmet Furkan) GitHub Settings'ten açması gerekiyor.

### Commit format (Conventional Commits)

```
<type>(<scope>): <subject>
```

| Type | Ne zaman |
|---|---|
| `feat` | Yeni özellik |
| `fix` | Bug düzeltme |
| `docs` | Sadece dokümantasyon |
| `chore` | Build, config, dependency |
| `refactor` | Davranış değişmedi, kod düzenlendi |
| `test` | Test eklendi/değiştirildi |
| `style` | Format / boşluk (kod mantığı değil) |

**Örnekler:**
```
feat(auth): add JWT-based login endpoint
fix(auth): resolve middleware headers already sent bug
feat(recipes): add search-by-ingredients endpoint
docs(readme): add deployment instructions
chore(deps): add helmet and express-rate-limit
test(recommendations): add edge case for empty input
```

**Subject kuralları:**
- 72 karakter altı
- Fiil **emir kipi** (İngilizce: "add", "fix"; "added", "fixed" değil)
- Sonunda nokta yok

---

## 🚫 YAPMA Listesi

| ❌ Yasak | Neden |
|---|---|
| `dangerouslySetInnerHTML` | XSS açığı. Markdown render gerekirse `react-markdown` veya `DOMPurify` kullan. |
| Password log'lama / response'a koyma | Güvenlik faciası. |
| Hardcoded secret (JWT_SECRET, API key, DB pw) | Repo'ya sızar, geri alınamaz. |
| `console.log` (committed) | Logger kullan (Faz 2 sonrası). Debug için yazdıysan commit etmeden sil. |
| `var` | Sadece `const` (default), gerektiğinde `let`. |
| `Promise.then()` chain | async/await kullan. |
| Manuel try/catch route'ta | `express-async-handler` kullan. |
| Try/catch içinde hata yutma (`catch (e) {}`) | En az `next(err)` veya `throw` ile yukarı geçir. |
| `// TODO` (issue açmadan) | TODO yazıyorsan GitHub Issue da aç + linkle. |
| API contract'ı (`docs/openapi.yaml`) tek başına değiştirme | Ekiple konuşulmadan değişmez. |
| Anlamadığın AI kodunu merge etme | Önce AI'a "açıkla" dedirt, anlamadan PR açma. |
| `.env` dosyasını commit'leme | `.gitignore`'da olmalı (✅). Sadece `.env.example` paylaşılır. |
| Test'siz kritik özellik merge (Faz 3 sonrası) | Auth, recommendation gibi kritik yerler için en az 1 happy path + 1 edge case. |
| `git push --force` (paylaşılan branch'e) | Geçmişi siler, ekibi yıkar. Sadece kendi feature branch'inde, gerekçeli. |
| Kullanılmayan import / değişken | ESLint uyarıyor. Commit'ten önce temizle. |
| Magic number (3, 86400 gibi açıklamasız sabit) | İsim ver: `const SESSION_DURATION_DAYS = 7;` |
| Orphan model / kullanılmayan dosya | Eğer modeli/dosyayı kullanmıyorsan SİL. Repo'ya çöp bırakma. |
| **Şema değişikliği `docs/openapi.yaml` güncellenmeden** | Şema = API contract. İkisi birlikte değişir. |

---

## 🧪 Testing

### Backend (Jest + supertest) — Faz 3'te eklenecek

`/backend/tests/` altına. `mongodb-memory-server` ile in-memory DB.

```javascript
// tests/auth.test.js
import request from 'supertest';
import { app } from '../server.js';
import { connectTestDb, closeTestDb, clearDb } from './helpers/db.js';

beforeAll(connectTestDb);
afterAll(closeTestDb);
beforeEach(clearDb);

describe('POST /api/auth/register', () => {
  it('creates user with valid input', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'a@b.com', password: 'password1', name: 'Test' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('a@b.com');
    expect(res.body.data.password).toBeUndefined();
    expect(res.body.data.token).toBeTruthy();
  });

  it('rejects duplicate email', async () => {
    // ...
    expect(res.body.success).toBe(false);
  });
});
```

**Coverage hedefi:** %70+. Kritik dosyalar (`middleware/authMiddleware`, recommendation logic) %85+.

### Frontend (Vitest + Testing Library)

`Component.test.tsx` dosyaları component'in yanında.

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RecipeCard } from './RecipeCard';

describe('RecipeCard', () => {
  it('renders recipe title and cook time', () => {
    render(
      <RecipeCard
        recipe={{ _id: '1', title: 'Menemen', cookTime: 15 } as Recipe}
      />
    );
    expect(screen.getByText('Menemen')).toBeInTheDocument();
    expect(screen.getByText(/15/)).toBeInTheDocument();
  });
});
```

API mock: **MSW** (Mock Service Worker). Gerçek backend'e bağımlı test **yazma**.

---

## 🤖 AI Agent'lar İçin Özel Talimatlar

Eğer sen bu projede çalışan bir AI agent isen:

1. **Bu dosyaya saygı duy.** Buradaki kuralları görmezden gelme. Bir kural senin önerinle çakışıyorsa, önce kuralı uygula veya kullanıcıya sor.

2. **Mevcut kodu okumadan yazma.** Aynı klasörde benzer bir controller/route var mı? Pattern'i koru, kopyala-uyarla.

3. **Backend JavaScript, frontend TypeScript.** Backend'de TS kod yazma (mevcut yapıyı bozmaz). Frontend'de JS kod yazma (TS bilinçli seçim).

4. **API contract (`docs/openapi.yaml`) tek doğru kaynaktır.** Backend'de endpoint yazıyorsan oraya bak. Frontend'de API çağırıyorsan oraya bak. **Bu dosyayı tek başına değiştirme** — değişiklik gerekiyorsa kullanıcıya sor.

5. **Response format `{ success, data/message }`.** Yeni endpoint yazarken bu formata kesinlikle uy. Mevcut kod bu format. Tutarsızlık frontend'de patlar.

6. **`express-async-handler` kullan.** Manuel try/catch route'ta yasak. Hata `throw new Error()` ile fırlat, `res.status(XXX)` önceden set et.

7. **Yarım iş bırakma.** Eklediğin import'u kullan. Tanımladığın fonksiyonu çağır. Yarım kalmış kod merge edilemez.

8. **Test yaz (Faz 3 itibarıyla).** Yeni endpoint için en az happy path test'i ekle.

9. **`.env.example`'ı güncel tut.** Yeni env değişkeni eklediğinde örneğini de ekle (gerçek değer değil — placeholder).

10. **`README.md`'yi güncel tut.** Kurulum adımı, yeni script, yeni env değişkeni eklediğinde README'ye yaz.

11. **Türkçe vs İngilizce karışımı:**
    - Kullanıcı arayüzü metni, hata mesajları → **Türkçe** (tarif başlığı, "Tarif bulunamadı")
    - Kod, değişken adı, fonksiyon adı, commit mesajı, log mesajı, kod yorumu → **İngilizce**

12. **Bilmiyorsan tahmin etme.** "Şöyle bir paket vardı sanırım" → kontrol et veya kullanıcıya sor. Halüsinasyon yapmaktansa "bilmiyorum" de.

13. **Büyük değişikliklerden önce planını söyle.** Birden fazla dosyaya yayılan refactor → önce neyi nasıl yapacağını yaz, kullanıcı onayladıktan sonra uygula.

14. **Hassas veri kuralları:**
    - Password, token, API key asla log'a yazma
    - Asla response'a koyma (kasıtlı endpoint hariç)
    - Asla commit message'a koyma
    - Asla AI prompt'a yapıştırma

15. **Orphan model/dosya bırakma.** Yarattığın model/util/fonksiyon kullanılmıyorsa ya bağla ya sil.

---

## 📚 Hızlı Referans

- **API endpoint listesi:** `docs/openapi.yaml` + Swagger UI `/api-docs`
- **User stories:** `docs/user-stories.md`
- **UI tasarım:** `docs/ui-spec.md`
- **Deploy:** `docs/deploy.md`
- **Proje planı (faz/görev):** `proje-plani.md`
- **Backend denetim raporu (11 May):** `docs/denetim-raporu.md`

---

## 🔄 Bekleyen Adaptasyonlar (Faz 2 başlamadan)

Backend denetim raporundan çıkan aksiyonlar:

- [ ] `authMiddleware.js:32` "headers already sent" bug → `else if` veya `return` ekle
- [ ] `JWT_SECRET` 64 karakter rastgele üret, `.env`'e yaz
- [ ] `userController.js:10` populate alanlarını Recipe şemasıyla uyumla
- [ ] `helmet` + `express-rate-limit` ekle (`server.js`)
- [ ] `express.json({ limit: '10kb' })` body size sınırı
- [ ] `zod` ekle, tüm endpoint'lere validation middleware
- [ ] `morgan` + `winston` logger
- [ ] Recipe şemasını zenginleştir: `ingredients: [{ name, amount, unit }]`, `description`, `difficulty`, `imageUrl`, `category`, `tags`
- [ ] `Ingredient` modeli için karar: sil veya kullan
- [ ] `MealPlan` modeli için karar: v2'ye atılacak mı?
- [ ] Eksik endpoint'ler (Recipe CRUD detayları, search-by-ingredients, favorites, recommendations) → Faz 2

---

> **Bu dosya canlı bir dokümandır.** Yeni öğrenilen pattern'ler, ekipte konuşulmuş yeni kararlar, geçilen tuzaklar buraya eklenir. Değişiklikler PR ile yapılır, ekibe duyurulur.
>
> **Son güncelleme:** 11 Mayıs 2026 (backend denetim raporu sonrası kod tabanına uyarlandı)
> **Sahibi:** Mehmet Furkan (PM)
