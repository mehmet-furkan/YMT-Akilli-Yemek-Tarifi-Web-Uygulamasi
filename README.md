# 🍳 Night Code Kitchen – Akıllı Yemek Tarifi Web Uygulaması

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

Kullanıcıların ellerindeki malzemelere göre eşleşme yüzdesiyle tarif öneren, puanlama/yorum, favori ve profil özellikleri sunan bir **MERN** stack web uygulaması.

> **Bir cümlede:** "Buzdolabında ne varsa onu yaz; biz sana ne pişirebileceğini, eksik malzemeleriyle birlikte söyleyelim."

---

## ✨ Özellikler

- 🥘 **Akıllı malzeme-bazlı öneri** — elindeki malzemelere göre tarifleri 0–100 eşleşme skoruyla sıralar, eksik malzemeleri gösterir
- 🔎 **Akıllı arama** — eş-anlamlı malzeme sözlüğü (ör. "et" → kıyma, kuşbaşı, sucuk…) ve Türkçe karakter duyarlı eşleşme
- 🥗 **Diyet filtreleme** — Vegan / Vejetaryen / Glutensiz / Laktozsuz tercihlerine göre eleme
- ⭐ **Puanlama & yorum** — 1–5 yıldız, tarif başına ortalama puan (denormalize cache)
- 🔖 **Favoriler** ve **profil sistemi** (tariflerim, taslaklarım, kaydedilenler, yorumlarım)
- 🔐 **Kimlik doğrulama** — JWT (e-posta/şifre) + **Google ile Giriş** (hesap birleştirme)
- 🍽️ **Tarif detayları** — porsiyon ölçekleme, sosyal paylaşım, rastgele tarif
- 📚 **Swagger UI** ile canlı API dokümantasyonu (`/api-docs`)
- 🛡️ **Güvenlik** — Helmet, HPP, rate limiting, zod doğrulama, bcrypt
- 📈 **Gözlemlenebilirlik** — winston loglama + Sentry hata izleme

---

## 📁 Proje Yapısı

```
├── backend/                  # Node.js + Express 5 API (JavaScript / CommonJS)
│   ├── config/               # db.js (MongoDB), swagger.js
│   ├── controllers/          # HTTP handler'lar (auth, users, recipes, comments, favorites, recommendations)
│   ├── lib/                  # asyncHandler, rateLimiters, sentry, validation/ (zod şemaları)
│   ├── middleware/           # authMiddleware (protect), errorMiddleware
│   ├── models/               # Mongoose şemaları (User, Recipe, Comment, Favorite, Ingredient)
│   ├── routes/               # API rotaları
│   ├── scripts/              # seed, seedRecipes, downloadImages, enrichNutrition, ...
│   ├── services/             # recommendation.service, rating.service (iş mantığı)
│   ├── tests/                # Jest birim testleri
│   ├── utils/                # logger (winston)
│   └── server.js             # Ana giriş noktası
│
├── client/                   # React 18 + Vite + TypeScript
│   ├── src/
│   │   ├── components/        # ui/ + feature/ + profile/ + ProtectedRoute
│   │   ├── contexts/          # AuthContext
│   │   ├── hooks/             # useAuth, useFavorites, useRecommendations, useRecipeComments
│   │   ├── lib/               # axios (interceptor'lı), queryClient
│   │   ├── pages/             # Login, Register, Home, RecipeDetail, Recommendation, Profile, ...
│   │   ├── types/             # API response tipleri
│   │   ├── utils/             # formatDuration, scaleAmount
│   │   └── main.tsx
│   └── vite.config.ts
│
├── docs/                     # openapi.yaml (API sözleşmesi), ui-spec, user-stories, deploy, handoff
├── .github/workflows/ci.yml  # CI: backend test + frontend build
├── docker-compose.yml
├── CLAUDE.md                 # AI agent kuralları / proje standartları
└── README.md
```

---

## 🚀 Hızlı Başlangıç (Yerel Geliştirme)

### Gereksinimler

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MongoDB** (yerel, Atlas veya Docker)

---

### 1. Backend Kurulumu

```bash
cd backend
cp .env.example .env    # Env dosyasını düzenleyin
npm install
npm run dev             # http://localhost:5001
```

> ⚠️ `JWT_SECRET` için güçlü bir değer üretin:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

#### Backend `.env` değişkenleri

| Değişken | Zorunlu | Açıklama |
| --- | --- | --- |
| `NODE_ENV` | ✅ | `development` / `production` |
| `PORT` | ✅ | API portu (varsayılan 5001) |
| `MONGO_URI` | ✅ | MongoDB bağlantı dizesi (yerel / Atlas / Docker'da `mongodb://mongo:27017/...`) |
| `JWT_SECRET` | ✅ | En az 64 karakter rastgele hex |
| `JWT_EXPIRE` | ✅ | Token süresi (ör. `7d`) |
| `CLIENT_URL` | ✅ | CORS için frontend origin (ör. `http://localhost:3000`) |
| `LOG_LEVEL` | — | winston log seviyesi (`debug`/`info`/`warn`/`error`) |
| `SENTRY_DSN` | — | Hata izleme; yalnızca `production`'da aktif. Boşsa atlanır |
| `SENTRY_TRACES_SAMPLE_RATE` | — | Trace örnekleme oranı (0–1, varsayılan 0.1) |
| `PIXABAY_API_KEY` | — | `images:backfill`/`images:download` için tarif görselleri |
| `GOOGLE_CLIENT_ID` | — | `POST /api/auth/google` için zorunlu (Google girişini kullanacaksanız) |

#### Veri ekme (seed) ve görseller

```bash
npm run seed:recipes     # 100 Türkçe tarifi veritabanına ekler (idempotent)
npm run seed:nutrition   # Tariflere tahmini besin değerlerini doldurur
npm run images:download  # Görselleri backend/public/images/ altına indirir (/images yolundan servis edilir)
```

> Tarif görselleri Pixabay'den çekilir; direkt URL'ler ~24 saatte geçersiz olduğu için kalıcı olarak self-host edilir (`backend/public/images/`, git'e girmez).

---

### 2. Client Kurulumu

```bash
cd client
cp .env.example .env    # Gerekirse VITE_API_URL'i düzenleyin
npm install
npm run dev             # http://localhost:3000
```

#### Client `.env` değişkenleri

| Değişken | Zorunlu | Açıklama |
| --- | --- | --- |
| `VITE_API_URL` | — | Backend API tam URL'i. Yerelde boş bırakılabilir; Vite proxy `/api`'yi `:5001`'e yönlendirir |
| `VITE_GOOGLE_CLIENT_ID` | — | "Google ile Giriş" butonu için (backend `GOOGLE_CLIENT_ID` ile aynı değer) |

> Geliştirme modunda `vite.config.ts`'deki proxy `/api` isteklerini otomatik olarak `http://localhost:5001`'e yönlendirir.

---

## 🐳 Docker ile Çalıştırma

```bash
docker-compose up --build
```

| Servis  | Port  | Açıklama                |
| ------- | ----- | ----------------------- |
| MongoDB | 27017 | Veritabanı              |
| Backend | 5001  | Express API             |
| Client  | 3000  | React (Vite) Uygulaması |

```bash
docker-compose down      # durdur
docker-compose down -v   # verileri de sil
```

---

## 🧪 Test

```bash
cd backend
npm test                 # Jest birim testleri (öneri motoru)
```

> Öneri mantığı `services/` katmanına çıkarıldığı için veritabanına bağlanmadan izole test edilir (`tests/recommendation.service.test.js`).

---

## 🛠 Teknoloji Yığını

### Backend
- Node.js + **Express 5** (CommonJS)
- MongoDB + **Mongoose**
- **JWT** kimlik doğrulama + **bcryptjs**, **google-auth-library** (Google OAuth)
- **zod** doğrulama, merkezi `errorMiddleware`, `asyncHandler`
- **Helmet**, **HPP**, **express-rate-limit** (güvenlik)
- **winston** (loglama), **@sentry/node** (hata izleme)
- **Swagger UI** (`swagger-ui-express` + `yamljs`)

### Client
- **React 18** + **TypeScript**
- **Vite** (build aracı), **Tailwind CSS v4**
- **React Router v7**, **TanStack React Query v5**
- **axios**, **react-hook-form** + **zod**
- **@react-oauth/google** (Google ile Giriş)

---

## 📄 API Uç Noktaları

Tam liste için `docs/openapi.yaml` veya `http://localhost:5001/api-docs` (Swagger UI).

### Auth — `/api/auth`
| Method | Endpoint | Açıklama | Auth |
| --- | --- | --- | --- |
| POST | `/register` | Kayıt ol | ❌ |
| POST | `/login` | Giriş yap | ❌ |
| POST | `/google` | Google ID token ile giriş/kayıt | ❌ |
| GET  | `/me` | Mevcut kullanıcı bilgisi | ✅ |
| POST | `/logout` | Çıkış | ❌ |

### Recipes — `/api/recipes`
| Method | Endpoint | Açıklama | Auth |
| --- | --- | --- | --- |
| GET  | `/` | Tarifleri listele (arama, filtre, sayfalama) | ❌ |
| POST | `/` | Yeni tarif ekle | ✅ |
| GET  | `/random` | Rastgele tarif | ❌ |
| POST | `/search-by-ingredients` | Malzeme bazlı arama (skorlu) | ❌ |
| GET  | `/:id` | Tarif detayı | ❌ |
| PUT  | `/:id` | Tarif güncelle (sahip) | ✅ |
| DELETE | `/:id` | Tarif sil (sahip) | ✅ |
| GET  | `/:id/comments` | Tarifin yorumları | ❌ |
| POST | `/:id/comments` | Yorum/puan ekle | ✅ |

### Diğer
| Method | Endpoint | Açıklama | Auth |
| --- | --- | --- | --- |
| POST | `/api/recommendations` | Malzemelere göre öneri | ❌ |
| GET  | `/api/favorites` | Favori listesi | ✅ |
| POST | `/api/favorites/:recipeId` | Favoriye ekle | ✅ |
| DELETE | `/api/favorites/:recipeId` | Favoriden çıkar | ✅ |
| DELETE | `/api/comments/:id` | Yorum sil (sahip) | ✅ |
| GET  | `/api/users/profile` | Profil bilgisi | ✅ |
| PUT  | `/api/users/profile` | Profili güncelle | ✅ |
| PUT  | `/api/users/preferences` | Diyet tercihlerini güncelle | ✅ |
| GET  | `/api/users/me/{stats,recipes,drafts,saved,comments}` | Profil sekmesi verileri | ✅ |
| GET  | `/api/health` | Sağlık kontrolü | ❌ |

---

## ☁️ Dağıtım (Deployment)

| Servis | Platform |
| --- | --- |
| Frontend | **Vercel** (root: `client`, env: `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`) |
| Backend | **Railway / Render** (env: `CLIENT_URL` — CORS için canlı frontend URL'i) |
| Database | **MongoDB Atlas** |

Detaylar için `docs/deploy.md`.

---

## 👥 Ekip

Night Code Kitchen — 6 kişilik 1. sınıf Yazılım Mühendisliği ekibi (AI-agent destekli geliştirme):

- Mehmet Furkan Akyar (PM)
- Muhammed Ali Yücesu
- Emre Cansever
- Furkan Yılmaz
- Emine Zehra Duymaz
- Muhammed Hanifi Taş (DevOps)

---

## 📝 Lisans

ISC
