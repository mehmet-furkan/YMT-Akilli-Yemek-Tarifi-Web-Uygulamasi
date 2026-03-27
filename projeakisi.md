# "Akilli Yemek Tarifi Uygulaması" - Proje Akışı

# 🥗 Akıllı Yemek Tarifi Web Uygulaması

## 📌 Proje Analiz ve Tanımlama Raporu

---

Hazırlayan: Emine Zehra Duyar
Tarih: 11 Mart 2026

---


### 1. Genel Vizyon 🎯
Mutfakta dijital bir dönüşüm yaratarak, kullanıcının elindeki kısıtlı imkanları (malzemeleri) maksimum verimle birer ziyafete dönüştüren, akıllı bir mutfak asistanı oluşturmak. Vizyonumuz; yemek yapmayı bir planlama yükü olmaktan çıkarıp, eğlenceli ve sürdürülebilir bir aktivite haline getirmektir.

### 2. Temel Amaç (Core Purpose) 🚀
Kullanıcıların sahip olduğu malzemelerle yapılabilecek en uygun tarifleri saniyeler içinde bularak; **"Ne pişirsem?"** kararsızlığını ortadan kaldırmak ve evdeki gıda israfını teknolojik bir çözümle minimize etmektir.

### 3. Stratejik Hedefler 📈
* **Malzeme Odaklı Dinamik Arama:** Kullanıcının girdiği malzemeleri veri tabanındaki tariflerle eşleştirerek yüksek doğrulukta sonuç döndürmek.
* **Kişiselleştirme:** Kullanıcı etkileşimlerini (beğeni, kayıt, filtreleme) analiz ederek her kullanıcıya özel bir deneyim sunmak.
* **Mobil Öncelikli Deneyim:** Kullanıcının mutfakta, tezgah başında rahatça kullanabileceği, ergonomik ve hızlı bir arayüz (UI/UX) sağlamak.
* **Gıda Tasarrufu:** Kullanıcıyı elindeki stokları tüketmeye teşvik ederek ekonomik fayda sağlamak.

### 4. Proje Kapsamı (Scope) 📦
* **Kullanıcı Yönetimi:** Kayıt olma, giriş yapma ve favori tarifleri saklama.
* **Gelişmiş Filtreleme:** Pişirme süresi, öğün türü ve diyet tercihlerine (vegan, glütensiz vb.) göre süzme işlemi.
* **Tarif Detaylandırma:** Malzeme listesi, adım adım hazırlanış yönergeleri ve ipuçları.
* **Öneri Motoru:** Kullanıcının geçmiş aramalarına dayalı "Sizin İçin Seçtiklerimiz" algoritması.

### 5. Kullanıcıya Sağlayacağı Değer (Value Proposition) 💎

| Değer Alanı | Açıklama |
| :--- | :--- |
| **Zaman Tasarrufu** | Tarif aramak için harcanan vakti minimize eder, saniyeler içinde sonuç sunar. |
| **Maliyet Avantajı** | Gereksiz alışverişi önleyerek evdeki mevcut malzemelerin değerlendirilmesini sağlar. |
| **Sağlık ve Diyet** | Kullanıcının özel beslenme gereksinimlerine (alerjenler, diyetler) uygun çözümler sunar. |
| **Mutfak Özgüveni** | Adım adım rehberlik sayesinde mutfakta yeni olanların bile başarılı olmasını sağlar. |

---


### Hafta 3 Görev : MongoDB veritabanı için veri modellemesi ve şema Tasarımı


# 🗄️ MongoDB Veri Modeli Tasarımı

Bu proje, NoSQL yapısına uygun, esnek ve yüksek performanslı arama odaklı bir veri mimarisi üzerine kurgulanmıştır.

## 1. Users (Kullanıcılar) Koleksiyonu
Sisteme kayıtlı kullanıcıların kimlik bilgilerini ve kişisel tercihlerini tutar.

| Alan | Veri Tipi | Açıklama |
| :--- | :--- | :--- |
| **_id** | ObjectId | Benzersiz kullanıcı kimliği |
| **name** | String | Ad ve Soyad |
| **email** | String | E-posta adresi (Unique/Benzersiz) |
| **password** | String | Hashlenmiş şifre |
| **preferences** | Object | `diet` (dizi) ve `allergies` (dizi) bilgilerini içerir |
| **favorites** | Array [ID] | Beğenilen tariflerin `Recipe` koleksiyonuna referansı |
| **createdAt** | Date | Kayıt tarihi |

## 2. Recipes (Tarifler) Koleksiyonu
Uygulamanın temelini oluşturan tarif verilerini ve malzeme eşleştirme yapısını tutar.

| Alan | Veri Tipi | Açıklama |
| :--- | :--- | :--- |
| **_id** | ObjectId | Benzersiz tarif kimliği |
| **title** | String | Tarif adı |
| **description** | String | Tarif hakkında kısa ön bilgi |
| **ingredients** | Array [Obj] | `name`, `amount` ve `optional` (boolean) alanlarını içerir |
| **instructions** | Array [Str] | Hazırlanış adımları (Sıralı liste) |
| **prepTime** | Number | Dakika cinsinden hazırlama süresi |
| **difficulty** | String | Zorluk seviyesi (Kolay, Orta, Zor) |
| **tags** | Array [Str] | Mutfak türü veya öğün etiketleri (Örn: "Diyet", "Aperatif") |
| **imageUrl** | String | Tarif görselinin URL bağlantısı |
| **createdBy** | ObjectId | Tarifi ekleyen kullanıcı referansı |

## 3. Ingredients (Malzemeler) Koleksiyonu
Arama motorunda tutarlılık sağlamak ve otomatik tamamlama sunmak için kullanılan referans listesidir.

| Alan | Veri Tipi | Açıklama |
| :--- | :--- | :--- |
| **_id** | ObjectId | Malzeme kimliği |
| **name** | String | Malzeme adı (Örn: "Soğan", "Zeytinyağı") |
| **category** | String | Kategori (Örn: "Sebze", "Baharat") |

---

## 🛠️ Tasarımın Teknik Avantajları
* **Hızlı Arama:** `ingredients` alanı içindeki nesne yapısı sayesinde, belirli bir malzemeye sahip olan tüm tarifler tek bir sorgu ile (Index destekli) getirilebilir.
* **Kişiselleştirme:** Kullanıcı şemasındaki `preferences` alanı, ana sayfada sunulacak "Öneri Motoru" için doğrudan filtreleme kriteri sağlar.
* **İlişkisel Yapı:** MongoDB'nin `populate` özelliği kullanılarak, favori tarifler ve kullanıcı profili arasında verimli bir bağ kurulmuştur.


