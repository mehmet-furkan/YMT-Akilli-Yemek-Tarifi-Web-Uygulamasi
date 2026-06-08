# 📋 NIGHT CODE KITCHEN — PROJE DEVİR ÖZETİ

> **Amaç:** Yeni bir AI agent session'ına projeyi hızlıca tanıtmak için bağlam dokümanı.
> Yeni bir görev başlatırken bu dosyayı `CLAUDE.md` ile birlikte bağlam olarak ver.
>
> **Son güncelleme:** 7 Haziran 2026

---

## 1. Proje & Ekip

- **İsim:** Night Code Kitchen — Akıllı Yemek Tarifi Web Uygulaması
- **Amaç:** Eldeki malzemelere göre tarif öneren, kişiselleştirilmiş MERN web app
- **Ekip:** 6 kişilik 1. sınıf yazılım mühendisliği öğrencisi, AI-agent destekli geliştirme
- **PM:** Mehmet Furkan (kullanıcı) — PR'ları **GitHub'da kendisi merge ediyor**, agent sadece feature branch açıp push'luyor
- **Diğer üyeler:** Emre, Emine, Furkan Yılmaz, Ali, Zehra, Hanifi Taş (DevOps)

---

## 2. Tech Stack (GERÇEK durum — varsayma)

| Katman | Teknoloji | ⚠️ Kritik not |
|---|---|---|
| Backend | Node + **Express 5**, **CommonJS** (`require`/`module.exports`) | `"type":"module"` YOK. Takım sık sık yanlışlıkla ESM yazıyor — düzelt |
| Frontend | React 18 + **TypeScript**, Vite, Tailwind v4, React Router v7, TanStack Query v5, axios, react-hook-form, zod | Frontend bilinçli TS |
| DB | **MongoDB Atlas** (artık cloud!) | Lokal/Docker mongo terk edildi |
| Auth | JWT (jsonwebtoken, bcryptjs), `protect` middleware | |
| Diğer | asyncHandler, central errorMiddleware, winston logger, @sentry/node, helmet, rate-limit, swagger | |

---

## 3. ⚠️ KRİTİK GÜNCEL DURUM

1. **DB artık MongoDB Atlas'ta:** `backend/.env` → `mongodb+srv://...ymtproje.vrcwfhj.mongodb.net/nightcodekitchen`. Lokal Docker mongo kullanılmıyor. **Deploy'a hazır.**
2. **Token storage artık `localStorage`** (eskiden sessionStorage'dı): Hem `client/src/lib/axios.ts` hem `client/src/contexts/AuthContext.tsx` `localStorage` kullanıyor — **ikisi tutarlı**, login çalışıyor. Oturum artık sekmeler arası kalıcı (eski "her oturumda yeniden giriş" gereksinimi terk edildi).
3. **JWT_SECRET:** 64-byte rastgele hex (`.env`'de, asla commit edilmez).
4. **PIXABAY_API_KEY:** `.env`'de tutuluyor (asla commit edilmez).

---

## 4. Çalıştırma (lokal geliştirme)

```bash
# Backend (Atlas'a bağlanır)
cd backend && npm install && npm run dev     # http://localhost:5001

# Frontend
cd client && npm install && npm run dev      # http://localhost:3000

# Seed (gerekirse)
cd backend && npm run seed:recipes && npm run images:download
```

- Vite proxy `/api` → `:5001` (sadece dev).
- Test kullanıcısı: `yavuz@test.com` / `Yavuz123`.

---

## 5. Tamamlanan İşler

- Auth (register/login/me) + gerçek DB bağlantısı + JWT
- **100 Türkçe tarif** seed'i (`backend/scripts/seedRecipes.js`, idempotent, system user'a bağlı)
- Görsel pipeline: Pixabay API + `downloadImages.js` (kalıcı self-host → `backend/public/images/`, `/images/...` ile servis)
- Comment sistemi refactor (asyncHandler, `{success, data}`)
- Profil sistemi (username, bio, city, photo, savedRecipes vb.) + ProfilePage / ProfileSettingsPage
- Navbar (profil dropdown, tab linkleri, logout), responsive audit (Görev 2 — "bir şey bozmadan")
- Fuzzy search (HomePage), kategori filtresi, favoriler, öneri sayfası
- Hanifi'nin DevOps kodu CommonJS'e çevrilip eklendi: logger, Sentry, CI (`.github/workflows/ci.yml`), `docs/deploy.md`
- Docker race condition + ENOENT swagger + veri kaybı kurtarma çözüldü

---

## 6. Çözülmüş Buglar (tekrar etme — kalıcı bilgi)

| Bug | Kök neden | Çözüm |
|---|---|---|
| Login çalışmıyor | axios localStorage ↔ AuthContext sessionStorage uyumsuzluğu | İkisi de localStorage'a sabitlendi |
| ESM/CommonJS hatası | Takım ESM yazıyor, backend CommonJS | require/module.exports'a çevir |
| Pixabay görselleri 24s'te ölüyor | Direkt URL expiry | `downloadImages.js` ile self-host |
| Docker mongo race | backend mongo hazır olmadan bağlanıyor | db.js retry + healthcheck (artık Atlas'la N/A) |
| Edit "File not read" | Get-Content değil Read tool kullan | Önce Read tool |
| Zayıf JWT_SECRET | tahmin edilebilir string | 64-byte hex |

---

## 7. 🔴 Açık / Bekleyen İşler

- **~7 açık branch merge bekliyor** (en önemlisi `feature/devops-infra` — image self-host + CI). Conflict riski birikiyor; deploy öncesi merge önerildi.
- **Deployment:** 3 servis gerekli →
  - **Vercel** (client, root dir = `client`, env `VITE_API_URL` = canlı backend URL)
  - **Railway/Render** (backend Express, env `CLIENT_URL` = Vercel URL — CORS için)
  - **Atlas** (DB, zaten hazır ✓)
  - Vite proxy prod'da çalışmaz. Akış: feature branch → PR → merge → otomatik canlı (~1-2 dk).
- Hanifi'nin gerçek GitHub email'i ile co-author commit düzeltmesi (şu an placeholder).
- (Opsiyonel) Remember Me'yi gerçekten uygula: işaretliyse localStorage, değilse sessionStorage.

---

## 8. CLAUDE.md Altın Kuralları (ihlal etme)

- Backend JS / Frontend TS — karıştırma
- Response: `{success, data}` / `{success, message}` (ikisi aynı anda DEĞİL)
- `express-async-handler` zorunlu, route'ta manuel try/catch YASAK
- `main`/`develop`'a direkt push YASAK → PR + review
- Commit: Conventional Commits (`feat(scope): ...`), İngilizce emir kipi
- `docs/openapi.yaml` (API contract) tek başına değiştirilmez
- Password/token asla log'a/response'a/commit'e; `.env` asla commit
- UI metni/hata → Türkçe; kod/log/commit → İngilizce
- console.log commit etme, magic number yok, orphan dosya bırakma

---

## 9. Ortam Notları

- Windows + PowerShell 5.1 (`&&` yok, `;` veya `if ($?)` kullan)
- `gh` CLI **kurulu değil** → PR'lar URL ile açılır
- CWD bazı çağrılarda sıfırlanır → **absolute path** kullan
- Git `ort` merge stratejisi conflict'leri genelde lehte çözer
