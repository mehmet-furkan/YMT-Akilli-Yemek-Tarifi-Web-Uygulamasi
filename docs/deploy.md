# Deploy Kontrol Listesi

Projemiz sürekli entegrasyon (CI) ve sürekli dağıtım (CD) süreçlerine sahiptir.
`develop` branch'ine yapılan her push veya merge işlemi otomatik olarak canlı
ortama (preview) yansır.

## Canlıya Alma (Deploy) Adımları

- [ ] Kodunuzu kendi feature branch'inizde geliştirin.
- [ ] Değişiklikleri `develop` branch'ine hedefleyen bir Pull Request (PR) açın.
- [ ] GitHub Actions'ın (CI) otomatik testleri çalıştırmasını bekleyin. (PR'da yeşil tik görünmeli.)
- [ ] Kod review sonrası PR onaylandığında merge işlemini gerçekleştirin.
- [ ] Merge işlemi sonrası:
  - **Frontend:** Vercel otomatik olarak yeni arayüzü derler.
  - **Backend:** Railway/Render otomatik olarak yeni sunucu kodunu başlatır.
- [ ] Yaklaşık 3-5 dakika içinde değişikliklerin Preview URL üzerinde canlıda olduğunu doğrulayın.

## Servis Bazlı Kurulum Notları

### Frontend — Vercel
1. Vercel hesabı aç, GitHub reposunu bağla.
2. Root directory: `client`
3. Build command: `npm run build` · Output: `dist`
4. Environment: `VITE_API_URL=<backend-public-url>/api`
5. `develop` branch'ini preview, `main` branch'ini production olarak ayarla.

### Backend — Railway / Render
1. Railway/Render hesabı aç, GitHub reposunu bağla.
2. Root directory: `backend`
3. Start command: `npm start`
4. Environment değişkenleri (production değerleriyle):
   `NODE_ENV=production`, `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`,
   `CLIENT_URL`, `LOG_LEVEL`, `SENTRY_DSN` (opsiyonel).

### Database — MongoDB Atlas
1. Atlas free tier (M0) cluster oluştur.
2. Connection string'i backend `MONGO_URI` env'ine koy.
3. Network Access'te backend host IP'sini (veya geçici olarak 0.0.0.0/0) whitelist'e al.

> **Not:** `CLIENT_URL` backend'in CORS whitelist'i için zorunlu — production frontend
> URL'ini buraya yaz, aksi halde tarayıcı istekleri CORS'tan bloklanır.
