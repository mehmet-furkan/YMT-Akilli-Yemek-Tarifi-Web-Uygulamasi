# 🍳 Night Code Kitchen – Akıllı Yemek Tarifi Web Uygulaması

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

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

#### Görselleri İndirme (Local Setup)

Tarif görselleri Pixabay'den çekiliyor ve direkt URL'ler ~24 saat sonra geçersiz
oluyor. Görselleri kalıcı olarak kendi sunucunuza indirmek için (tarifler
seed'lendikten sonra) backend klasöründe şu komutu çalıştırın:

```bash
npm run images:download
```

Görseller `backend/public/images/` altına iner (git'e girmez) ve `/images/...`
yolundan servis edilir.

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
