# 📋 Akıllı Yemek Tarifi Web Uygulaması — User Stories

**Proje:** Night Code Kitchen  
**Hazırlanma Tarihi:** 12 Mayıs 2026  
**Toplam Story:** 12

---

## 🔐 Kayıt / Giriş / Hesap Yönetimi

### US-01: Kullanıcı Kaydı
> **Bir ziyaretçi olarak,** e-posta ve şifremle sisteme kayıt olabilmek istiyorum, **çünkü** favori tariflerimi kaydetmek ve kişiselleştirilmiş öneriler almak için bir hesaba ihtiyacım var.

**Kabul Kriterleri:**
- [ ] Ad, e-posta ve şifre alanlarını doldurarak kayıt formu gönderilebilir.
- [ ] Zaten kayıtlı bir e-posta ile tekrar kayıt olunmaya çalışıldığında anlamlı bir hata mesajı gösterilir.
- [ ] Başarılı kayıt sonrası kullanıcı otomatik olarak giriş yapmış durumda ana sayfaya yönlendirilir.

---

### US-02: Kullanıcı Girişi
> **Kayıtlı bir kullanıcı olarak,** e-posta ve şifremle giriş yapabilmek istiyorum, **çünkü** kişisel profilime, favorilerime ve önceki aramalarıma erişmek istiyorum.

**Kabul Kriterleri:**
- [ ] Geçerli e-posta ve şifre ile giriş yapıldığında JWT token üretilir ve oturum başlatılır.
- [ ] Yanlış e-posta veya şifre girildiğinde "Geçersiz e-posta veya şifre" hatası gösterilir (hangisinin yanlış olduğu belirtilmez — güvenlik).
- [ ] Giriş yapmış kullanıcı sayfayı yenilediğinde oturumu korunur (token localStorage'da saklanır).

---

### US-03: Şifremi Unuttum
> **Şifresini unutan bir kullanıcı olarak,** e-posta adresime sıfırlama bağlantısı gönderilmesini istiyorum, **çünkü** hesabıma tekrar erişebilmem gerekiyor.

**Kabul Kriterleri:**
- [ ] "Şifremi Unuttum" sayfasında e-posta girilip gönderildiğinde, kayıtlıysa sıfırlama bağlantısı e-posta ile iletilir.
- [ ] Sıfırlama bağlantısı 1 saat sonra geçersiz hale gelir.
- [ ] Yeni şifre belirlendikten sonra kullanıcı giriş sayfasına yönlendirilir ve eski şifre ile giriş yapılamaz.

---

## 🔍 Malzemeye Göre Tarif Arama

### US-04: Eldeki Malzemelerle Tarif Bulma
> **Bir kullanıcı olarak,** buzdolabımdaki malzemeleri girerek yapabileceğim tarifleri görmek istiyorum, **çünkü** evde ne varsa onunla yemek yapmak ve gereksiz alışverişten kaçınmak istiyorum.

**Kabul Kriterleri:**
- [ ] Kullanıcı arama çubuğuna birden fazla malzeme girebilir (etiket/tag şeklinde).
- [ ] Sonuçlar eşleşme oranına göre sıralanır ("Hemen Yapılabilir" → "1 malzeme eksik" → diğerleri).
- [ ] Her tarif kartında eksik malzeme sayısı ve eşleşme yüzdesi görünür.

---

### US-05: Misafir Olarak Tarif Arama (Guest Mode)
> **Kayıt olmamış bir ziyaretçi olarak,** giriş yapmadan malzeme girip tarif arayabilmek istiyorum, **çünkü** uygulamayı denemeden önce kayıt olmaya zorlanmak istemiyorum.

**Kabul Kriterleri:**
- [ ] Ana sayfadaki arama çubuğu giriş yapmadan kullanılabilir.
- [ ] Arama sonuçları ve tarif detayları giriş yapmadan görüntülenebilir.
- [ ] Favorilere ekleme gibi kişisel işlemler denendiğinde giriş/kayıt modalı açılır.

---

## 🎛️ Filtreleme

### US-06: Kategori, Süre ve Zorluk Filtresi
> **Bir kullanıcı olarak,** arama sonuçlarını mutfak türü, hazırlama süresi ve zorluk seviyesine göre filtreleyebilmek istiyorum, **çünkü** sadece bana uygun tarifleri görmek zaman kazandırır.

**Kabul Kriterleri:**
- [ ] Filtre panelinde "Mutfak Türü" (Türk, İtalyan vb.), "Süre" (0-15 dk, 15-30 dk, 30-60 dk, 60+ dk) ve "Zorluk" (Kolay, Orta, Zor) seçenekleri bulunur.
- [ ] Birden fazla filtre aynı anda uygulanabilir ve sonuçlar anlık güncellenir.
- [ ] Aktif filtreler görünür şekilde etiketlenir ve tek tıkla temizlenebilir.

---

## 📖 Tarif Detay Sayfası

### US-07: Tarif Detayını Görüntüleme
> **Bir kullanıcı olarak,** bir tarifin malzeme listesini, adım adım yapılışını ve fotoğrafını görebilmek istiyorum, **çünkü** tarifi doğru şekilde hazırlayabilmem için tüm bilgilere ihtiyacım var.

**Kabul Kriterleri:**
- [ ] Tarif detay sayfasında başlık, açıklama, malzeme listesi (miktar dahil), sıralı hazırlanış adımları ve en az bir fotoğraf gösterilir.
- [ ] Hazırlama süresi ve zorluk seviyesi açıkça belirtilir.
- [ ] Hazırlanış adımları checklist formatında olup tıklandığında tamamlandı olarak işaretlenebilir.

---

## ❤️ Favori İşlemleri

### US-08: Tarif Favoriye Ekleme ve Çıkarma
> **Giriş yapmış bir kullanıcı olarak,** beğendiğim tarifleri favorilerime ekleyip çıkarabilmek istiyorum, **çünkü** tekrar yapmak istediğim tariflere kolayca ulaşmak istiyorum.

**Kabul Kriterleri:**
- [ ] Tarif kartında ve detay sayfasında kalp simgeli favori butonu bulunur.
- [ ] Butona tıklandığında tarif anında favorilere eklenir/çıkarılır ve buton durumu değişir (dolu kalp ↔ boş kalp).
- [ ] Favori tarifler profil sayfasında ayrı bir sekmede listelenir.

---

## 🎯 Kişiselleştirilmiş Öneriler

### US-09: "Sana Özel" Tarif Listesi
> **Giriş yapmış bir kullanıcı olarak,** beslenme tercihlerime ve geçmiş aramalarıma göre kişiselleştirilmiş tarif önerileri almak istiyorum, **çünkü** bana uygun yeni tarifler keşfetmek istiyorum.

**Kabul Kriterleri:**
- [ ] Ana sayfada "Sizin İçin Seçtiklerimiz" bölümünde en az 5 kişiselleştirilmiş tarif önerisi gösterilir.
- [ ] Öneriler, kullanıcının diyet tercihleri (Vegan, Keto vb.) ve alerjen bilgilerine göre filtrelenmiş olur.
- [ ] Kullanıcı favori ekleme/arama geçmişi değiştikçe öneriler güncellenir.

---

## 👤 Profil Yönetimi

### US-10: Profil Sayfası ve Tercih Ayarları
> **Giriş yapmış bir kullanıcı olarak,** profil sayfamdan ad, e-posta, diyet tercihlerimi ve alerjen bilgilerimi güncelleyebilmek istiyorum, **çünkü** uygulama bana daha doğru sonuçlar sunsun.

**Kabul Kriterleri:**
- [ ] Profil sayfasında ad, e-posta, diyet tipi (çoklu seçim) ve alerjen listesi düzenlenebilir.
- [ ] Değişiklikler "Kaydet" butonuyla uygulanır ve başarı mesajı gösterilir.
- [ ] Diyet tercihleri güncellendikten sonra ana sayfadaki öneriler buna göre yenilenir.

---

## 📱 Mobil Uyumluluk

### US-11: Mobil Cihazda Rahat Kullanım
> **Mobil cihazından erişen bir kullanıcı olarak,** uygulamayı telefonumdan rahatça kullanabilmek istiyorum, **çünkü** mutfakta genellikle telefonumu kullanıyorum ve masaüstü bilgisayar başında değilim.

**Kabul Kriterleri:**
- [ ] Tüm sayfalar 320px genişliğe kadar responsive olarak çalışır, yatay kaydırma çubuğu oluşmaz.
- [ ] Dokunmatik ekranda butonlar ve etkileşimli alanlar en az 44×44px boyutundadır.
- [ ] Tarif detay sayfasında malzeme listesi ve adımlar dikey kaydırmayla rahatça takip edilebilir.

---

### US-12: Mutfakta Adım Adım Tarif Takibi
> **Mutfakta yemek yapan bir kullanıcı olarak,** tarif adımlarını büyük fontla, tek tek ilerleyerek görebilmek istiyorum, **çünkü** ellerim meşgulken küçük yazıları okumak ve kaydırmak zor oluyor.

**Kabul Kriterleri:**
- [ ] Tarif detay sayfasında "Pişirme Moduna Geç" butonu bulunur.
- [ ] Pişirme modunda her adım tam ekran gösterilir ve "İleri" / "Geri" butonlarıyla adımlar arasında geçiş yapılır.
- [ ] Ekran zaman aşımına uğramaz (wake lock) ve font boyutu standart görünümden en az %50 daha büyüktür.

---

## 📊 Özet Tablosu

| ID | Story Başlığı | Kapsam Alanı | Öncelik |
|:---|:---|:---|:---|
| US-01 | Kullanıcı Kaydı | Kayıt/Giriş | Yüksek |
| US-02 | Kullanıcı Girişi | Kayıt/Giriş | Yüksek |
| US-03 | Şifremi Unuttum | Kayıt/Giriş | Orta |
| US-04 | Eldeki Malzemelerle Tarif Bulma | Malzeme Arama | Yüksek |
| US-05 | Misafir Olarak Tarif Arama | Malzeme Arama | Yüksek |
| US-06 | Kategori, Süre ve Zorluk Filtresi | Filtreleme | Yüksek |
| US-07 | Tarif Detayını Görüntüleme | Tarif Detay | Yüksek |
| US-08 | Favoriye Ekleme/Çıkarma | Favoriler | Orta |
| US-09 | "Sana Özel" Tarif Listesi | Kişisel Öneri | Orta |
| US-10 | Profil ve Tercih Ayarları | Profil | Orta |
| US-11 | Mobil Cihazda Rahat Kullanım | Mobil | Yüksek |
| US-12 | Mutfakta Adım Adım Takip | Mobil | Düşük |
