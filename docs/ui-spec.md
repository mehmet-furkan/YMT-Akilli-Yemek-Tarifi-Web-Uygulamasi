# 🎨 UI Spec — Akıllı Yemek Tarifi Web Uygulaması

**Sorumlu:** Furkan Yılmaz
**Görev:** 1.4 — UI Mockup (Ana Sayfalar)

> Figma yok — ASCII wireframe + component listesi yeterli.
> Tüm sayfalar **mobile-first** tasarlanmıştır. Breakpoint: `sm: 640px`, `md: 768px`, `lg: 1024px`.

---

## Genel Layout (Tüm Sayfalar)

```
┌─────────────────────────────────────────────┐
│  NAVBAR  [Logo] [Arama] [Profil] [Çıkış]   │  ← fixed top, z-50
├─────────────────────────────────────────────┤
│                                             │
│               SAYFA İÇERİĞİ                │
│                                             │
└─────────────────────────────────────────────┘
```

**Navbar Component:** `Navbar.tsx` (`components/ui/`)
- Logo → `/` rotasına link
- Giriş yapılmamışsa: `[Giriş Yap]` `[Kayıt Ol]`
- Giriş yapılmışsa: kullanıcı avatarı (baş harfi) → `/profile` linki + `[Çıkış]`
- Mobil: hamburger menü, `<Sheet>` drawer ile açılır

**State:** `AuthContext`'ten `isAuthenticated`, `user`

---

## 1. LoginPage / RegisterPage

**Rota:** `/login` · `/register`

### LoginPage Wireframe

```
┌────────────────────────────────────────────────────┐
│ NAVBAR                                             │
├────────────────────────────────────────────────────┤
│                                                    │
│           ┌────────────────────────┐               │
│           │  🍳 Akıllı Mutfak     │               │
│           │                        │               │
│           │  E-posta               │               │
│           │  [____________________]│               │
│           │                        │               │
│           │  Şifre                 │               │
│           │  [____________________]│               │
│           │                        │               │
│           │  [    Giriş Yap    ]   │               │
│           │                        │               │
│           │  Hesabın yok mu?       │               │
│           │  Kayıt Ol              │               │
│           └────────────────────────┘               │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Mobile:** Kart tam genişlik, padding `px-4`
**md:** Kart `max-w-md`, `mx-auto`, `mt-20`

### RegisterPage Wireframe

```
┌────────────────────────────────────────────────────┐
│ NAVBAR                                             │
├────────────────────────────────────────────────────┤
│           ┌────────────────────────┐               │
│           │  🍳 Hesap Oluştur     │               │
│           │                        │               │
│           │  Ad Soyad              │               │
│           │  [____________________]│               │
│           │                        │               │
│           │  E-posta               │               │
│           │  [____________________]│               │
│           │                        │               │
│           │  Şifre                 │               │
│           │  [____________________]│               │
│           │                        │               │
│           │  Şifre Tekrar          │               │
│           │  [____________________]│               │
│           │                        │               │
│           │  [    Kayıt Ol     ]   │               │
│           │                        │               │
│           │  Zaten hesabın var mı? │               │
│           │  Giriş Yap             │               │
│           └────────────────────────┘               │
└────────────────────────────────────────────────────┘
```

### Component Listesi

| Component | Dosya | Not |
|---|---|---|
| `LoginPage` | `pages/auth/LoginPage.tsx` | Sayfa bileşeni |
| `RegisterPage` | `pages/auth/RegisterPage.tsx` | Sayfa bileşeni |
| `Input` | `components/ui/Input.tsx` | `label`, `error` prop'u var |
| `Button` | `components/ui/Button.tsx` | `loading` prop → spinner göster |
| `AuthCard` | `components/ui/AuthCard.tsx` | Ortak kart wrapper |

### API Çağrısı

| Sayfa | Endpoint | Method |
|---|---|---|
| Login | `/auth/login` | `POST` |
| Register | `/auth/register` | `POST` |

### State

```
// Local (react-hook-form)
{ email, password, name?, confirmPassword? }

// Global (AuthContext)
{ user, token } — başarılı login sonrası set edilir
```

### Mobil Değişiklikler

- Kart: `rounded-none` → `rounded-2xl` (md'den itibaren)
- Input height: `h-12` (touch target ≥44px)

### Loading / Boş / Hata State'leri

| Durum | Gösterim |
|---|---|
| Loading | Buton içi spinner, disabled |
| Hata (401/400) | Kartın altında kırmızı `Alert` bileşeni |
| Başarı | Otomatik `/` redirect (hiç görülmez) |

---

## 2. HomePage (Arama + Tarif Listesi)

**Rota:** `/`
**Erişim:** Guest + Auth (fark yok, favorile auth gerektirir)

### Desktop Wireframe

```
┌────────────────────────────────────────────────────────────────┐
│ NAVBAR                                                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   ┌─── SEARCH BAR ──────────────────────────────────────────┐ │
│   │  🔍 Tarif veya malzeme ara...                           │ │
│   │                                                          │ │
│   │  Malzemeler: [domates ×] [soğan ×] [+ ekle]            │ │
│   └──────────────────────────────────────────────────────────┘ │
│                                                                │
│   ┌─ FİLTRE (sidebar, lg: sabit) ─┐  ┌─ TARİF GRID ───────┐ │
│   │  Kategori                      │  │ ┌──────┐ ┌──────┐  │ │
│   │  ○ Tümü  ○ Kahvaltı           │  │ │Kart 1│ │Kart 2│  │ │
│   │  ○ Çorba ○ Ana Yemek          │  │ └──────┘ └──────┘  │ │
│   │  ○ Tatlı ○ Salata             │  │ ┌──────┐ ┌──────┐  │ │
│   │                                │  │ │Kart 3│ │Kart 4│  │ │
│   │  Süre (maks.)                  │  │ └──────┘ └──────┘  │ │
│   │  ────────●──── 60 dk          │  │                     │ │
│   │                                │  │  [Daha fazla yükle] │ │
│   │  Zorluk                        │  └─────────────────────┘ │
│   │  [ ] Kolay [x] Orta [ ] Zor   │                          │
│   └────────────────────────────────┘                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Mobile Wireframe

```
┌──────────────────────────────────────┐
│ NAVBAR  [☰]                         │
├──────────────────────────────────────┤
│                                      │
│ ┌── SEARCH BAR ─────────────────┐   │
│ │ 🔍 Tarif veya malzeme ara...  │   │
│ │ [domates ×] [+ ekle]          │   │
│ └───────────────────────────────┘   │
│                                      │
│ [🔧 Filtrele]  ← floating button    │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │            Kart 1               │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │            Kart 2               │ │
│ └──────────────────────────────────┘ │
│                                      │
│ [Daha fazla yükle]                  │
└──────────────────────────────────────┘
```

Filtre butonu → bottom sheet açılır (mobil drawer)

### RecipeCard Wireframe

```
┌────────────────────────────────────┐
│  [            FOTOĞRAF           ] │ ← aspect-video, object-cover
│  [            16:9               ] │
├────────────────────────────────────┤
│  [Kahvaltı]        ⏱ 25 dk       │ ← Badge + süre
│  Menemen                           │ ← font-semibold, line-clamp-1
│  Kolay · Zehra tarafından         │ ← text-sm text-muted
└────────────────────────────────────┘
```

### Component Listesi

| Component | Dosya | Not |
|---|---|---|
| `HomePage` | `pages/HomePage.tsx` | Sayfa bileşeni |
| `SearchBar` | `components/feature/SearchBar.tsx` | Text input + chip input combo |
| `IngredientChipInput` | `components/feature/IngredientChipInput.tsx` | Enter ile chip ekle, × ile sil |
| `FilterPanel` | `components/feature/FilterPanel.tsx` | Desktop sidebar / mobile drawer |
| `RecipeCard` | `components/feature/RecipeCard.tsx` | Foto, başlık, badge, süre |
| `RecipeGrid` | `components/feature/RecipeGrid.tsx` | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| `LoadMoreButton` | `components/ui/Button.tsx` | variant="outline" |
| `EmptyState` | `components/ui/EmptyState.tsx` | Eşleşme yoksa görünür |
| `Skeleton` | `components/ui/Skeleton.tsx` | Loading için kart iskeleti |

### API Çağrısı

```
GET /recipes?search=&ingredient[]=&category=&maxCookTime=&page=&limit=12
```

Hook: `useRecipes(filters)` → `hooks/useRecipes.ts` (TanStack Query)

### State

```
// Local (URL query params ile senkron)
{ search, ingredients[], category, maxCookTime, page }

// Server state
TanStack Query cache — "recipes" query key
```

### Mobil Değişiklikler

- Grid: `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3`
- FilterPanel: drawer (bottom sheet) → `lg:` sticky sidebar
- SearchBar: tam genişlik, yükseklik `h-14`

### Loading / Boş / Hata State'leri

| Durum | Gösterim |
|---|---|
| Loading | 6 adet `SkeletonCard` (kart boyutunda gri placeholder) |
| Boş sonuç | `EmptyState`: illüstrasyon + "Tarif bulunamadı, farklı malzemeler dene" |
| Hata | Kırmızı `Alert` + "Tekrar dene" butonu |
| Daha fazla yükle loading | Butonda spinner |

---

## 3. RecipeDetailPage (Tarif Detayı)

**Rota:** `/recipe/:id`
**Erişim:** Guest (okuma) + Auth (favorileme)

### Desktop Wireframe

```
┌──────────────────────────────────────────────────────────────────┐
│ NAVBAR                                                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ← Geri         Menemen                              [♡ Kaydet] │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │                       FOTOĞRAF                          │   │
│  │                    (aspect-video)                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Kahvaltı]  ⏱ 25 dk  👤 Kolay  🍽 4 porsiyon               │
│                                                                  │
│  ┌──── MALZEMELER (1/3 genişlik) ─┐ ┌── ADIMLAR (2/3) ────────┐│
│  │                                │ │                          ││
│  │  ● 3 yumurta                   │ │  1. Soğanları küçük      ││
│  │  ● 2 adet domates              │ │     küçük doğrayın.      ││
│  │  ● 1 adet biber                │ │                          ││
│  │  ● Zeytinyağı                  │ │  2. Zeytinyağını ısıtın  ││
│  │  ● Tuz, karabiber              │ │     ve soğanları ekleyin.││
│  │                                │ │                          ││
│  │  [🛒 Alışveriş Listesine Ekle]│ │  3. Domatesleri ekleyin  ││
│  │                                │ │     ve 5 dk pişirin.     ││
│  └────────────────────────────────┘ │                          ││
│                                     │  4. Yumurtaları kırın.   ││
│                                     └──────────────────────────┘│
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Mobile Wireframe

```
┌────────────────────────────────────┐
│ NAVBAR  [←]             [♡]       │
├────────────────────────────────────┤
│ [          FOTOĞRAF             ]  │
│ [          16:9                  ] │
│                                    │
│ Menemen                            │
│ [Kahvaltı] ⏱ 25 dk  🍽 4 kişi   │
│                                    │
│ ─── Malzemeler ───────────────    │
│  ● 3 yumurta                       │
│  ● 2 adet domates                  │
│  ● 1 adet biber                    │
│                                    │
│ ─── Hazırlanış ───────────────    │
│  1. Soğanları doğrayın.            │
│  2. Zeytinyağını ısıtın...         │
│  3. Domatesleri ekleyin...         │
│                                    │
│ [🛒 Alışveriş Listesine Ekle]     │
└────────────────────────────────────┘
```

### Component Listesi

| Component | Dosya | Not |
|---|---|---|
| `RecipeDetailPage` | `pages/RecipeDetailPage.tsx` | Sayfa bileşeni |
| `RecipeHero` | `components/feature/RecipeHero.tsx` | Fotoğraf + başlık + favori butonu |
| `RecipeMeta` | `components/feature/RecipeMeta.tsx` | Badge, süre, porsiyon, zorluk row'u |
| `IngredientList` | `components/feature/IngredientList.tsx` | `ul` madde listesi |
| `InstructionList` | `components/feature/InstructionList.tsx` | Numaralı adım listesi |
| `FavoriteToggle` | `components/feature/FavoriteToggle.tsx` | Kalp ikonu, optimistic update |
| `Badge` | `components/ui/Badge.tsx` | Kategori, zorluk etiketleri |
| `Skeleton` | `components/ui/Skeleton.tsx` | Loading için alan tutucular |

### API Çağrıları

| İşlem | Endpoint | Method |
|---|---|---|
| Tarif getir | `/recipes/:id` | `GET` |
| Favori ekle | `/favorites/:recipeId` | `POST` |
| Favori çıkar | `/favorites/:recipeId` | `DELETE` |
| Favoriler (başlangıçta) | `/favorites` | `GET` |

Hook: `useRecipe(id)` + `useFavorites()`

### State

```
// Server state
{ recipe } — TanStack Query, "recipe/:id" key

// Optimistic (TanStack Query mutation)
favorites[] — kalp tıklanınca anında UI değişir, hata olursa geri alınır

// Local
isExpanded — adımlar (mobil'de collapse/expand opsiyonel)
```

### Mobil Değişiklikler

- Layout: 2 kolon grid → tek kolon stack
- Malzemeler bölümü: üstte, adımlar altında
- Favori butonu: sağ üst köşede sabit (navbar içinde)

### Loading / Boş / Hata State'leri

| Durum | Gösterim |
|---|---|
| Loading | Tam sayfa skeleton (foto + içerik alanları) |
| 404 | `NotFoundPage` — "Bu tarif bulunamadı" + Anasayfaya dön butonu |
| Favori hata | `Toast` — "Favorilere eklenemedi, tekrar dene" + rollback |
| Auth gerekli (favori) | Butona hover → Tooltip "Favorilere eklemek için giriş yap" |

---

## 4. ProfilePage (Profil)

**Rota:** `/profile`
**Erişim:** Sadece Auth — `AuthContext.isAuthenticated` false ise `/login`'e redirect (`ProtectedRoute`)

### Desktop Wireframe

```
┌──────────────────────────────────────────────────────────────────┐
│ NAVBAR                                                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ PROFIL HEADER ─────────────────────────────────────────┐   │
│  │   [  MF  ]    Mehmet Furkan                             │   │
│  │   (avatar)    mehmet@example.com                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Bilgilerim]  [Favorilerim]  [Yemek Planım]                   │
│  ─────────────────────────────────────────────                  │
│                                                                  │
│  ← SEKMELERİN İÇERİĞİ (aşağıda)                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Sekme 1 — Bilgilerim

```
┌────────────────────────────────────────────────┐
│  Ad Soyad                                      │
│  Mehmet Furkan                  (read-only v1) │
│                                                │
│  E-posta                                       │
│  mehmet@example.com             (read-only)    │
│                                                │
│  Diyet Tercihlerim                             │
│  [Vegan] [Vejetaryen] [Glutensiz]              │
│  [Laktozsuz] [Keto]                            │
│  (seçili olanlar renkli, diğerleri outline)    │
│                                                │
│  [  Tercihleri Kaydet  ]                       │
└────────────────────────────────────────────────┘
```

### Sekme 2 — Favorilerim

```
┌────────────────────────────────────────────────┐
│  ┌────────┐  ┌────────┐  ┌────────┐           │
│  │ Kart 1 │  │ Kart 2 │  │ Kart 3 │           │
│  └────────┘  └────────┘  └────────┘           │
│  (RecipeCard grid — aynı homepage grid'i)      │
└────────────────────────────────────────────────┘
```

Boş durum: "Henüz favori tarifiniz yok. Tarifleri keşfet →"

### Sekme 3 — Yemek Planım (v2 Placeholder)

```
┌────────────────────────────────────────────────┐
│                                                │
│  🚧 Bu özellik yakında geliyor!               │
│                                                │
│  Haftalık yemek planınızı buradan             │
│  oluşturabileceksiniz.                         │
│                                                │
└────────────────────────────────────────────────┘
```

### Mobile Wireframe

```
┌──────────────────────────────────┐
│ NAVBAR  [←]                     │
├──────────────────────────────────┤
│  [MF]  Mehmet Furkan            │
│        mehmet@example.com        │
│                                  │
│  [Bilgilerim] [Favoriler] [Plan] │  ← horizontal scroll tab
│  ─────────────────────────────   │
│                                  │
│  (sekme içeriği)                 │
└──────────────────────────────────┘
```

### Component Listesi

| Component | Dosya | Not |
|---|---|---|
| `ProfilePage` | `pages/ProfilePage.tsx` | Sayfa bileşeni |
| `ProtectedRoute` | `components/ui/ProtectedRoute.tsx` | Auth yoksa redirect |
| `ProfileHeader` | `components/feature/ProfileHeader.tsx` | Avatar + isim + email |
| `ProfileTabs` | `components/feature/ProfileTabs.tsx` | Sekme nav |
| `DietPreferences` | `components/feature/DietPreferences.tsx` | Chip multiselect |
| `RecipeGrid` | `components/feature/RecipeGrid.tsx` | Favoriler için yeniden kullanılır |
| `EmptyState` | `components/ui/EmptyState.tsx` | Favoriler boşsa |

### API Çağrıları

| İşlem | Endpoint | Method |
|---|---|---|
| Profil getir | `/auth/me` | `GET` |
| Tercih güncelle | `/users/profile` | `PUT` |
| Favoriler | `/favorites` | `GET` |

### State

```
// Global
AuthContext.user — email, name (profil header)

// Server state
favorites[] — TanStack Query "favorites" key
preferences — PUT /users/profile mutation
```

### Mobil Değişiklikler

- Sekme başlıkları: yatay kaydırmalı (`overflow-x-auto`, `whitespace-nowrap`)
- Favoriler grid: `grid-cols-1` → `sm:grid-cols-2`
- Avatar: 48px → `md:` 64px

### Loading / Boş / Hata State'leri

| Durum | Gösterim |
|---|---|
| Loading | Profil header skeleton + grid skeleton |
| Favoriler boş | `EmptyState` + Tarifleri Keşfet butonu |
| Tercih kaydetme | Buton spinner, başarıda `Toast` "Kaydedildi ✓" |
| Auth yok | Otomatik `/login` redirect (kullanıcı görmez) |

---

## 5. RecommendationPage (Öneri)

**Rota:** `/recommendations`
**Erişim:** Guest + Auth (fark yok)

### Desktop Wireframe

```
┌──────────────────────────────────────────────────────────────────┐
│ NAVBAR                                                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ ÖNERI MOTORU ──────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  🍳 Elindeki malzemeleri yaz, sana ne yapabileceğini    │   │
│  │     önerelim!                                            │   │
│  │                                                          │   │
│  │  [domates ×] [soğan ×] [yumurta ×]  [+ Malzeme ekle]  │   │
│  │                                                          │   │
│  │                    [ Öneri Al ]                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ─── Sonuçlar (3 tarif bulundu) ───────────────────────────    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ ┌────────┐  Menemen                    %100 eşleşti │       │
│  │ │ FOTO  │  [Kahvaltı]  ⏱ 25 dk  👤 Kolay          │       │
│  │ └────────┘  Eksik malzeme yok ✓                     │       │
│  └──────────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ ┌────────┐  Omlet                      %80 eşleşti  │       │
│  │ │ FOTO  │  [Kahvaltı]  ⏱ 10 dk  👤 Kolay          │       │
│  │ └────────┘  Eksik: un (1 malzeme)                   │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Mobile Wireframe

```
┌──────────────────────────────────┐
│ NAVBAR                          │
├──────────────────────────────────┤
│                                  │
│ 🍳 Elindeki malzemeleri yaz     │
│                                  │
│ [domates ×] [soğan ×]           │
│ [____________________] [Ekle]   │
│                                  │
│      [ Öneri Al ]               │
│                                  │
│ ─── 3 tarif bulundu ──────     │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ [FOTO] Menemen   %100 ✓    │ │
│ │        Kolay · 25 dk        │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ [FOTO] Omlet     %80       │ │
│ │        Eksik: un            │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

### RecommendationCard Wireframe (Sonuç Kartı)

```
┌──────────────────────────────────────────────────┐
│  ┌──────────┐   Menemen                          │
│  │          │   [Kahvaltı] ⏱ 25 dk  👤 Kolay   │
│  │  FOTOĞRAF│                                    │
│  │  (kare)  │   ████████████░░  %80 eşleşti     │
│  │          │                                    │
│  └──────────┘   ✓ domates  ✓ soğan  ✓ yumurta  │
│                 ✗ Eksik: un, peynir              │
└──────────────────────────────────────────────────┘
```

Score gösterimi: renk kodu
- `%100` → yeşil (`text-green-600`)
- `%75+` → sarı (`text-yellow-600`)
- `%50+` → turuncu (`text-orange-600`)

### Component Listesi

| Component | Dosya | Not |
|---|---|---|
| `RecommendationPage` | `pages/RecommendationPage.tsx` | Sayfa bileşeni |
| `IngredientChipInput` | `components/feature/IngredientChipInput.tsx` | Aynı bileşen, yeniden kullanılır |
| `RecommendationCard` | `components/feature/RecommendationCard.tsx` | Score çubuğu + eşleşen/eksik liste |
| `ScoreBadge` | `components/feature/ScoreBadge.tsx` | Yüzde + renk kodu |
| `EmptyState` | `components/ui/EmptyState.tsx` | Eşleşme yoksa |
| `Skeleton` | `components/ui/Skeleton.tsx` | Öneri yüklenirken |

### API Çağrısı

```
POST /recommendations
Body: { ingredients: string[] }
Response: { data: [{ recipe, score, matchedIngredients, missingIngredients }] }
```

Hook: `useRecommendations()` → `hooks/useRecommendations.ts` (TanStack Query mutation)

### State

```
// Local
ingredients: string[]  — chip input'tan gelen liste

// Server state (mutation sonrası)
results: RecommendationResult[] — query cache'e yazılmaz, mutation sonucu
isLoading, error
```

### Mobil Değişiklikler

- Chip input: `flex-wrap`, `gap-2`, satır dolunca alta kayar
- Sonuç kartları: tam genişlik, fotoğraf sol tarafta küçük (`w-24 h-24`)
- Ekle butonu: input'un yanında `md:` ayrı, mobil inline

### Loading / Boş / Hata State'leri

| Durum | Gösterim |
|---|---|
| Boş input | "Öneri Al" butonu `disabled` |
| Loading | 3 adet `SkeletonCard` (öneri boyutunda) |
| Boş sonuç | `EmptyState` — "Eşleşen tarif bulunamadı. Daha az malzeme ile dene veya farklı malzeme ekle." |
| Hata (500) | Kırmızı `Alert` + "Tekrar dene" butonu |
| Başarı | Sonuç sayısı: "X tarif bulundu" başlığı ile liste |

---

## Ortak UI Bileşenleri Özeti

`/client/src/components/ui/` altında tüm projenin kullandığı atomik bileşenler:

| Bileşen | Açıklama |
|---|---|
| `Button` | `variant`: primary / outline / ghost. `loading` prop → spinner. Minimum `h-11` (44px touch) |
| `Input` | `label`, `error`, `placeholder` prop. Focus ring: `ring-2 ring-amber-500` |
| `Badge` | Kategori, zorluk, diyet etiketi. `variant`: default / success / warning |
| `Card` | `rounded-2xl shadow-sm border`. Çocuk olarak herhangi içerik alır |
| `Modal` | ESC ile kapat, backdrop click kapat, focus trap |
| `Toast` | Sağ alt köşe, 3s sonra otomatik kapanır. success / error / info varyantları |
| `Skeleton` | `animate-pulse` gri bloklar. `SkeletonCard` preset'i var |
| `EmptyState` | İllüstrasyon + başlık + açıklama + opsiyonel aksiyon butonu |
| `Alert` | Hata mesajı kutusu. `variant`: error / warning / info |
| `ProtectedRoute` | Auth kontrolü, yoksa `/login`'e redirect |

---

## Renk Paleti & Tipografi

Tailwind config'de özelleştirilecek:

```js
// tailwind.config.ts
colors: {
  primary:  '#D97706', // amber-600 (sıcak turuncu)
  surface:  '#FFFBF5', // krem beyaz arka plan
  muted:    '#6B7280', // gri metin
  success:  '#16A34A', // yeşil (eşleşme)
  danger:   '#DC2626', // kırmızı (hata)
}
```

Font: `Inter` (Google Fonts) — system-ui fallback.

---

*Bu dosya `docs/ui-spec.md` olarak repoya commit edilmelidir.*
*Faz 2'de component yazılırken bu spec referans alınır; büyük sapmalarda önce PM'e sorulur.*
