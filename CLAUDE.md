# CLAUDE.md — Proje Kuralları

> 📌 **Bu dosya AI agent'ları için yazılmıştır.** Antigravity, Claude Code, Cursor, Copilot ve benzer her AI bu dosyayı okur ve buradaki kurallara uyarak kod yazar. Yeni bir agent görevi başlatırken bu dosyayı bağlam olarak ver.

---

## 📌 Proje Hakkında

- **İsim:** Akıllı Yemek Tarifi Web Uygulaması
- **Amaç:** Kullanıcıların elindeki malzemelere göre tarif öneren, kişiselleştirilmiş yemek planı oluşturabilen web app
- **Ekip:** 6 kişilik 1. sınıf yazılım mühendisliği öğrencisi
- **Geliştirme yöntemi:** AI agent destekli (Antigravity + Opus 4.6 vs.)
- **Süre:** 9-30 Mayıs 2026 (21 gün)

---

## 🛠 Tech Stack

| Katman | Teknoloji |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, TanStack Query, react-hook-form, zod, axios |
| **Backend** | Node.js 20+, Express 4, TypeScript, Mongoose 7, jsonwebtoken, bcrypt, zod, pino |
| **Database** | MongoDB 7 |
| **Backend Test** | Jest + supertest + mongodb-memory-server |
| **Frontend Test** | Vitest + Testing Library + MSW |
| **Deploy** | Vercel (frontend), Railway (backend), MongoDB Atlas (DB) |

> Yeni bağımlılık eklemeden önce mevcut listede karşılığı var mı kontrol et. "shadcn/ui" gibi opsiyonel UI lib'i ekleneceği zaman PR'da gerekçe yaz.

---

## 📁 Klasör Yapısı

```
/
├── backend/
│   ├── src/
│   │   ├── config/        # MongoDB connection, sabitler
│   │   ├── controllers/   # HTTP handler'lar (route → service köprüsü)
│   │   ├── routes/        # Express route tanımları
│   │   ├── services/      # İş mantığı (DB'den bağımsız test edilebilir)
│   │   ├── models/        # Mongoose şemaları + interface'ler
│   │   ├── middleware/    # auth, errorHandler, requestLogger, validate
│   │   ├── lib/           # env.ts, logger.ts, jwt.ts
│   │   ├── lib/validation # zod schema'ları (auth.schema.ts, recipe.schema.ts)
│   │   ├── utils/         # asyncHandler, AppError
│   │   ├── scripts/       # seed.ts, createIndexes.ts
│   │   ├── __tests__/     # Jest testleri
│   │   └── server.ts      # entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/        # Button, Input, Card, Modal (atomic)
│   │   │   └── feature/   # RecipeCard, SearchBar, FavoriteToggle (composite)
│   │   ├── pages/         # LoginPage, HomePage, RecipeDetailPage, ...
│   │   ├── contexts/      # AuthContext
│   │   ├── hooks/         # useAuth, useRecipes, useFavorites
│   │   ├── lib/           # api.ts (axios), queryClient.ts, env.ts
│   │   ├── types/         # API response tipleri
│   │   ├── utils/
│   │   └── main.tsx
│   ├── .env.example       # VITE_API_URL=...
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│   ├── openapi.yaml       # ⚠️ API SÖZLEŞMESİ — TEK BAŞINA DEĞİŞTİRME
│   ├── user-stories.md
│   ├── ui-spec.md
│   └── deploy.md
│
├── .github/
│   └── workflows/
│       └── ci.yml         # lint + typecheck + test
│
├── docker-compose.yml     # local dev: MongoDB + backend + client
├── README.md
└── CLAUDE.md              # ← bu dosya
```

**Yeni klasör eklerken:** Yapıya uy. Yeni "geçici" klasörler açma. Belirsizse mevcut bir klasörün altına sok.

---

## 🔤 Naming Convention

| Tip | Stil | Örnek |
|---|---|---|
| Function / variable | `camelCase` | `getUserById`, `cookTime`, `isLoading` |
| React component | `PascalCase` | `RecipeCard`, `LoginPage` |
| TypeScript type / interface | `PascalCase` | `User`, `RecipeResponse` |
| Sabit (constant) | `UPPER_SNAKE_CASE` | `MAX_LOGIN_ATTEMPTS`, `JWT_EXPIRES_IN` |
| Component dosyası | `PascalCase.tsx` | `RecipeCard.tsx` |
| Utility / hook dosyası | `camelCase.ts` | `formatDate.ts`, `useAuth.ts` |
| Klasör | `camelCase` veya `kebab-case` (proje boyunca tek tip — biz `camelCase` kullanıyoruz) | `mealPlans/` |
| Env değişkeni | `UPPER_SNAKE_CASE` | `MONGODB_URI`, `JWT_SECRET` |
| MongoDB koleksiyon | lowercase, çoğul | `users`, `recipes` |
| API route | kebab-case, çoğul | `/recipes`, `/meal-plans` |

**İsim seçim kuralı:** İsim, ne yaptığını/ne tuttuğunu anlatmalı. `data`, `temp`, `obj`, `x`, `arr` gibi belirsiz isimler **YASAK**. `recipeData` da fazla → `recipe` yeter.

---

## ⚡ Async / Await Zorunlu

`Promise.then()` chain **YASAK**. Tüm async kod async/await ile yazılır.

```typescript
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
    logger.error({ err }, 'Failed to load user');
  }
}
```

Tek istisna: `.catch()` veya `.finally()` zincirinin **tek kullanımı** (örn TanStack Query mutation handler'ı).

---

## 🚨 Hata Yönetimi (Backend)

Backend'de hata yönetimi **3 parça**: `AppError` class + `asyncHandler` + global `errorHandler` middleware.

### 1. AppError class (`/backend/src/utils/AppError.ts`)

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }

  static notFound(resource: string) {
    return new AppError(404, 'NOT_FOUND', `${resource} not found`);
  }
  static unauthorized(msg = 'Unauthorized') {
    return new AppError(401, 'UNAUTHORIZED', msg);
  }
  static forbidden(msg = 'Forbidden') {
    return new AppError(403, 'FORBIDDEN', msg);
  }
  static conflict(msg: string) {
    return new AppError(409, 'CONFLICT', msg);
  }
  static badRequest(msg: string, details?: unknown) {
    return new AppError(400, 'BAD_REQUEST', msg, details);
  }
}
```

### 2. asyncHandler wrapper (`/backend/src/utils/asyncHandler.ts`)

Manuel try/catch yerine bunu kullan:

```typescript
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler =
  (fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
```

### 3. Kullanım örneği

```typescript
// ❌ YASAK (manuel try/catch route'ta)
router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Not found' });
    res.json({ data: recipe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DOĞRU
router.get('/recipes/:id', asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) throw AppError.notFound('Recipe');
  res.json({ data: recipe });
}));
```

### 4. Global errorHandler middleware (`/backend/src/middleware/errorHandler.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { logger } from '../lib/logger';
import { env } from '../lib/env';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details }
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: err.flatten()
      }
    });
  }

  logger.error({ err, path: req.path }, 'Unhandled error');
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: env.NODE_ENV === 'production'
        ? 'Internal server error'
        : (err as Error).message
    }
  });
}
```

**`server.ts`'de en son mount edilir:**
```typescript
app.use(errorHandler); // mutlaka sonda
```

---

## ✅ Validation (zod)

Her endpoint'in `body`, `query` ve `params`'ı **zod ile validate** edilir.

```typescript
// /backend/src/lib/validation/auth.schema.ts
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

export type RegisterInput = z.infer<typeof registerSchema>;
```

```typescript
// /backend/src/middleware/validate.ts
import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body); // throw → errorHandler yakalar
    next();
  };

export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    req.query = schema.parse(req.query);
    next();
  };
```

```typescript
// route'ta kullanım
router.post(
  '/auth/register',
  validateBody(registerSchema),
  asyncHandler(authController.register)
);
```

**Frontend tarafında da zod kullan** — react-hook-form ile birlikte. Aynı schema'yı paylaşmaya çalışma (frontend ↔ backend arası kopyala — şimdilik basit).

---

## 📦 Response Shape Standardı

Tüm API response'ları aşağıdaki shape'i kullanır.

### Başarı

```json
{ "data": { ... } }
```

veya liste:

```json
{ "data": [ ... ] }
```

Sayfalama varsa `meta`:

```json
{
  "data": [ ... ],
  "meta": { "total": 145, "page": 2, "totalPages": 13, "limit": 12 }
}
```

### Hata

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Recipe not found",
    "details": { "field": "id" }
  }
}
```

> **Hem `data` hem `error` aynı response'ta YOK.** Ya biri ya öbürü.

---

## 🔒 Güvenlik Kuralları

### 1. Password asla response'a / log'a koyma

Mongoose `User.password` field'ı `select: false` olmalı. Manuel `select('+password')` sadece login için yapılır:

```typescript
// ✅ DOĞRU
const user = await User.findOne({ email }).select('+password');
const ok = await bcrypt.compare(input.password, user.password);
if (!ok) throw AppError.unauthorized('Invalid credentials');

const safeUser = user.toObject();
delete safeUser.password;
res.json({ data: { user: safeUser, token } });
```

### 2. Env değişkenleri sadece `/lib/env.ts` üzerinden

`process.env.X` doğrudan kullanım **YASAK**. Tek bir yerde validate edilir, type-safe export edilir:

```typescript
// /backend/src/lib/env.ts
import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET en az 32 karakter olmalı'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().url(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  SENTRY_DSN: z.string().optional()
});

export const env = envSchema.parse(process.env);
```

Kullanım:
```typescript
import { env } from '../lib/env';
mongoose.connect(env.MONGODB_URI);
```

Frontend için aynı pattern — `/client/src/lib/env.ts`, `import.meta.env.VITE_*` üzerinden.

### 3. Hardcoded secret YASAK

JWT_SECRET, API key, DB password kodda asla. **Sadece env'de.** `.env` dosyası `.gitignore`'da, `.env.example` repo'da.

### 4. Zorunlu güvenlik middleware'leri

`server.ts`'de:

```typescript
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dk
  max: 10,                   // IP başına 10 istek
  message: { error: { code: 'RATE_LIMITED', message: 'Too many attempts' } }
});
app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);
```

### 5. Input sanitization

Kullanıcıdan gelen string'leri MongoDB query'sinde RAW kullanma:

```typescript
// ❌ YASAK — NoSQL injection açığı
User.find({ email: req.body.email });  // body parse edilmemişse {$gt: ''} gibi gelebilir

// ✅ DOĞRU — zod validate edip string olarak alıyorsun
const { email } = registerSchema.parse(req.body); // string garantili
User.find({ email });
```

`$where`, raw query string, eval **YASAK**.

---

## 📝 Logging

`console.log` **YASAK**. `pino` logger kullan.

```typescript
// /backend/src/lib/logger.ts
import pino from 'pino';
import { env } from './env';

export const logger = pino({
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined
});
```

Kullanım:
```typescript
import { logger } from '../lib/logger';

// ❌ YASAK
console.log('User logged in', user.email);

// ✅ DOĞRU
logger.info({ userId: user._id }, 'User logged in');
logger.error({ err, path: req.path }, 'Login failed');
```

**Log'a hassas veri yazma:** password, JWT token, bcrypt hash, kredi kartı, kişisel veri vb.

Frontend'de `console.log` debug için kullanılabilir ama **commit'lemeden sil**. Production'a `console.log` sızması yasak.

---

## 🌳 Git & Commit Format

### Branch stratejisi

- `main` → production (otomatik prod deploy)
- `develop` → staging (otomatik preview deploy)
- `feature/<isim>` → yeni özellik (örn `feature/auth-login`)
- `fix/<isim>` → bug fix
- `docs/<isim>` → sadece dokümantasyon

`main` ve `develop`'a **doğrudan push YASAK**. PR zorunlu, en az 1 review.

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
fix(recipes): handle empty ingredient list in search
docs(readme): add deployment instructions
chore(deps): upgrade mongoose to 7.5
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
| `any` type | TypeScript'in tüm faydası gider, AI hatası yakalanamaz. Bilmiyorsan `unknown` kullan, sonra `if (typeof x === ...)` ile daralt. |
| `dangerouslySetInnerHTML` | XSS açığı. Markdown render gerekirse `react-markdown` veya `DOMPurify` kullan. |
| Password log'lama / response'a koyma | Güvenlik faciası. |
| Hardcoded secret (JWT_SECRET, API key, DB pw) | Repo'ya sızar, geri alınamaz. |
| `console.log` (committed) | Logger kullan. Debug için yazdıysan commit etmeden sil. |
| `var` | Sadece `const` (default), gerektiğinde `let`. |
| `Promise.then()` chain | async/await kullan. |
| `process.env.X` doğrudan | `env.X` (validate edilmiş) üzerinden. |
| Manuel try/catch route'ta | `asyncHandler` kullan. |
| `// TODO` (issue açmadan) | TODO yazıyorsan GitHub Issue da aç + linkle. |
| API contract'ı tek başına değiştirme | `docs/openapi.yaml` ekiple konuşulmadan değişmez. |
| Anlamadığın AI kodunu merge etme | Önce AI'a "açıkla" dedirt, anlamadan PR açma. |
| `.env` dosyasını commit'leme | `.gitignore`'da olmalı. Sadece `.env.example` paylaşılır. |
| Test'siz kritik özellik merge | Auth, recommendation, payment gibi yerler için en az 1 happy path + 1 edge case test'i. |
| `git push --force` (paylaşılan branch'e) | Geçmişi siler, ekibi yıkar. Sadece kendi feature branch'inde, gerekçeli. |
| Kullanılmayan import / değişken | ESLint uyarıyor. Commit'ten önce temizle. |
| Magic number (3, 86400 gibi açıklamasız sabit) | İsim ver: `const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;` |

---

## 🧪 Testing

### Backend (Jest + supertest)

`/backend/src/__tests__/` altına. `mongodb-memory-server` ile in-memory DB.

```typescript
// /backend/src/__tests__/auth.test.ts
import request from 'supertest';
import { app } from '../app';
import { connectTestDb, closeTestDb, clearDb } from './helpers/db';

beforeAll(connectTestDb);
afterAll(closeTestDb);
beforeEach(clearDb);

describe('POST /auth/register', () => {
  it('creates user with valid input', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'a@b.com', password: 'password1', name: 'Test' });

    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe('a@b.com');
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.token).toBeTruthy();
  });

  it('rejects duplicate email with 409', async () => {
    // ...
  });

  it('rejects invalid email format with 400', async () => {
    // ...
  });
});
```

**Coverage hedefi:** %70+. CI'da fail eşiği. Kritik dosyalar (`services/`, `middleware/auth`) %85+.

### Frontend (Vitest + Testing Library)

`Component.test.tsx` dosyaları yan yana, `__tests__/` klasörü gerekirse.

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RecipeCard } from './RecipeCard';

describe('RecipeCard', () => {
  it('renders recipe title and cook time', () => {
    render(
      <RecipeCard
        recipe={{ _id: '1', title: 'Menemen', cookTime: 15, category: 'kahvaltı' } as any}
      />
    );
    expect(screen.getByText('Menemen')).toBeInTheDocument();
    expect(screen.getByText(/15 dk/i)).toBeInTheDocument();
  });
});
```

API mock: **MSW** (Mock Service Worker). Gerçek backend'e bağımlı test **yazma**.

---

## 🤖 AI Agent'lar İçin Özel Talimatlar

Eğer sen bu projede çalışan bir AI agent isen:

1. **Bu dosyaya saygı duy.** Buradaki kuralları görmezden gelme. Bir kural senin önerinle çakışıyorsa, önce kuralı uygula veya kullanıcıya sor.

2. **Mevcut kodu okumadan yazma.** Aynı klasörde benzer bir component / endpoint var mı? Yapıyı koru, kopyala-uyarla.

3. **API contract (`docs/openapi.yaml`) tek doğru kaynaktır.** Backend'de endpoint yazıyorsan oraya bak. Frontend'de API çağırıyorsan oraya bak. **Bu dosyayı tek başına değiştirme** — değişiklik gerekiyorsa kullanıcıya sor.

4. **Yarım iş bırakma.** Eklediğin import'u kullan. Tanımladığın type'ı uygula. Kullandığın fonksiyonu yaz. Yarım kalmış kod merge edilemez.

5. **Test yaz.** Yeni endpoint, yeni service fonksiyonu, kritik UI davranışı için en az happy path test'i ekle.

6. **`.env.example`'ı güncel tut.** Yeni env değişkeni eklediğinde örneğini de ekle (gerçek değer değil, örnek/placeholder).

7. **`README.md`'yi güncel tut.** Kurulum adımı, yeni script, yeni env değişkeni eklediğinde README'ye yaz.

8. **Türkçe vs İngilizce karışımı:**
   - Kullanıcı arayüzü metni → **Türkçe** (tarif başlığı, hata mesajları, buton yazısı)
   - Kod, değişken adı, fonksiyon adı, commit mesajı, log mesajı, kod yorumu → **İngilizce**

9. **Bilmiyorsan tahmin etme.** "Şöyle bir paket vardı sanırım" → kontrol et veya kullanıcıya sor. Halüsinasyon yapmaktansa "bilmiyorum" de.

10. **Büyük değişikliklerden önce planını söyle.** Birden fazla dosyaya yayılan refactor → önce neyi nasıl yapacağını yaz, kullanıcı onayladıktan sonra uygula.

11. **Hassas veri kuralları:**
    - Password, token, API key asla log'a yazma
    - Asla response'a koyma (kasıtlı endpoint hariç)
    - Asla commit message'a koyma
    - Asla AI prompt'a yapıştırma

12. **`any` görürsen düzelt.** Kod review yaparken `any` type bulursan dikkatleri çek veya doğrusunu öner.

---

## 📚 Hızlı Referans

- **API endpoint listesi:** `docs/openapi.yaml` + Swagger UI `/api-docs`
- **User stories:** `docs/user-stories.md`
- **UI tasarım:** `docs/ui-spec.md`
- **Deploy:** `docs/deploy.md`
- **Proje planı (faz/görev):** `proje-plani.md`

---

> **Bu dosya canlı bir dokümandır.** Yeni öğrenilen pattern'ler, ekipte konuşulmuş yeni kararlar, geçilen tuzaklar buraya eklenir. Değişiklikler PR ile yapılır, ekibe duyurulur.
>
> **Son güncelleme:** 8 Mayıs 2026
> **Sahibi:** Mehmet Furkan (PM)
