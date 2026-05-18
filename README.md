# 🍳 Night Code Kitchen – Akıllı Yemek Tarifi Web Uygulaması

Kullanıcıların ellerindeki malzemelere göre tarif önerileri sunan ve kişiselleştirilmiş yemek planları oluşturabilen bir MERN stack web uygulaması.

---

## 📁 Proje Yapısı

```
├── backend/          # Node.js + Express API
│   ├── config/       # DB & Swagger ayarları
│   ├── controllers/  # İş mantığı
│   ├── middleware/    # Auth & hata yönetimi
│   ├── models/       # Mongoose şemaları
│   ├── routes/       # API rotaları
│   └── server.js     # Ana giriş noktası
│
├── client/           # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/   # Paylaşılabilir UI bileşenleri
│   │   ├── contexts/     # React Context Provider'ları
│   │   ├── lib/          # Axios, React Query ayarları
│   │   └── pages/        # Sayfa bileşenleri
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Hızlı Başlangıç (Yerel Geliştirme)

### Gereksinimler

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MongoDB** (yerel veya Atlas) – ya da Docker

---

### 1. Backend Kurulumu

```bash
cd backend
cp .env.example .env   # Env dosyasını düzenleyin
npm install
npm run dev             # http://localhost:5001
```

> **`.env` değişkenleri:**
> ```env
> NODE_ENV=development
> PORT=5001
> MONGO_URI=mongodb://localhost:27017/nightcodekitchen
> JWT_SECRET=<64-karakter-rastgele-string>
> JWT_EXPIRE=7d
> CLIENT_URL=http://localhost:3000
> ```
>
> ⚠️ `JWT_SECRET` için güçlü bir değer üretin:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

---

### 2. Client Kurulumu

```bash
cd client
cp .env.example .env   # Gerekirse VITE_API_URL'i düzenleyin
npm install
npm run dev             # http://localhost:3000
```

> **`.env` değişkenleri:**
> ```env
> VITE_API_URL=http://localhost:5001/api
> ```
>
> ⚠️ Geliştirme modunda `vite.config.ts`'deki proxy `/api` isteklerini otomatik olarak `http://localhost:5001`'e yönlendirir, bu yüzden `.env` dosyasını boş bırakmanız da yeterlidir.

---

## 🐳 Docker ile Çalıştırma

Tüm servisleri tek komutla ayağa kaldırın:

```bash
docker-compose up --build
```

| Servis   | Port  | Açıklama                |
| -------- | ----- | ----------------------- |
| MongoDB  | 27017 | Veritabanı              |
| Backend  | 5001  | Express API             |
| Client   | 3000  | React (Vite) Uygulaması |

Durdurmak için:

```bash
docker-compose down
```

Veritabanı verilerini de silmek için:

```bash
docker-compose down -v
```

---

## 🛠 Teknoloji Yığını

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT Authentication
- Helmet, HPP, Rate Limiting
- Swagger API Docs

### Client
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS v4
- React Router v7
- TanStack React Query v5
- Axios

---

## 📄 API Uç Noktaları

Tam liste için `docs/openapi.yaml` veya `http://localhost:5001/api-docs` (Swagger UI).

| Method | Endpoint | Açıklama | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Kayıt ol | ❌ |
| POST | `/api/auth/login` | Giriş yap | ❌ |
| GET  | `/api/users/profile` | Profil bilgisi | ✅ |
| PUT  | `/api/users/profile` | Profili güncelle | ✅ |
| GET  | `/api/recipes` | Tarifleri listele | ❌ |
| POST | `/api/recipes` | Yeni tarif ekle | ✅ |
| GET  | `/api/recipes/:id` | Tarif detayı | ❌ |
| PUT  | `/api/recipes/:id` | Tarif güncelle (sahip) | ✅ |
| DELETE | `/api/recipes/:id` | Tarif sil (sahip) | ✅ |
| POST | `/api/recipes/search-by-ingredients` | Malzeme bazlı arama | ❌ |

---

## 📝 Lisans

ISC
