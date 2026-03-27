# "Akilli Yemek Tarifi Uygulaması" - Proje Akışı

# Yazılım Gereksinim Spesifikasyonu (SRS)

## 1. Proje Genel Bakışı
**Proje Adı:** Akıllı Mutfak ve Kişiselleştirilmiş Yemek Planlayıcı  
**Hazırlayan:** Emre Cansever  
**Tarih:** 17.03.2026  
**Kapsam:** Web Uygulaması

---

## 2. Fonksiyonel Gereksinimler (Functional Requirements)
Sistemin kullanıcıya sunacağı temel yetenekler aşağıda listelenmiştir:

| ID | Gereksinim Adı | Açıklama |
| :--- | :--- | :--- |
| **FR-1** | Üyelik Sistemi | E-posta ve şifre ile güvenli kayıt, giriş ve profil yönetimi sağlanmalıdır. |
| **FR-2** | Beslenme Tercihleri | Kullanıcılar Vegan, Vejetaryen, Keto gibi diyet tiplerini ve alerjenlerini tanımlayabilmelidir. |
| **FR-3** | Malzeme Girişi | Kullanıcılar ellerindeki malzemeleri liste veya serbest metin olarak sisteme girebilmelidir. |
| **FR-4** | Akıllı Eşleşme | Sistem, malzemelere göre en yüksek uyum oranına sahip tarifleri öncelikli listelemelidir. |
| **FR-5** | Gelişmiş Filtreleme | Hazırlama süresi, kalori, zorluk seviyesi ve mutfak türüne göre filtreleme yapılabilmelidir. |
| **FR-6** | Yemek Planlayıcı | Seçilen tarifler haftalık takvim üzerinde öğünlere (Sabah, Öğle, Akşam) atanabilmelidir. |

---

## 3. Fonksiyonel Olmayan Gereksinimler (Non-Functional Requirements)

* **NFR-1 (Performans):** Malzeme bazlı tarif arama sonuçları 2 saniyenin altında yüklenmelidir.
* **NFR-2 (Kullanılabilirlik):** Uygulama "Mobile-First" (Önce Mobil) tasarımıyla her ekran boyutuna tam uyumlu olmalıdır.
* **NFR-3 (Güvenlik):** Kullanıcı şifreleri BCrypt algoritması ile hashlenerek saklanmalı ve yetkisiz erişim önlenmelidir.
* **NFR-4 (Ölçeklenebilirlik):** Sistem, eşzamanlı olarak 500+ aktif kullanıcıyı destekleyebilecek altyapıya sahip olmalıdır.

---

## 4. Kullanıcı Hikayeleri (User Stories)

* **Öğrenci:** "Bir üniversite öğrencisi olarak, buzdolabındaki 3-4 malzemeyi girip hızlıca ne pişirebileceğimi görmek istiyorum, böylece hem para hem vakit kazanırım."
* **Sağlık Bilinçli Kullanıcı:** "Diyet yapan bir birey olarak, sadece profilimde belirttiğim kalori aralığına ve diyet tipine uygun tarifleri görmek istiyorum."
* **Planlı Kullanıcı:** "Yoğun çalışan biri olarak, hafta sonundan tüm haftanın yemek listesini planlayıp her gün ne yapacağımı bilmek istiyorum."

---

## 5. Kullanım Senaryosu (Use Case)

| **Senaryo Kalemi** | **Detaylar** |
| :--- | :--- |
| **Senaryo Adı** | UC-01: Malzemeye Göre Tarif Arama |
| **Aktör** | Kayıtlı Kullanıcı |
| **Ön Koşul** | Kullanıcının sisteme başarılı şekilde giriş yapmış olması. |
| **Ana Akış** | 1. Kullanıcı 'Mutfaktakiler' sekmesine gider. <br> 2. Elindeki malzemeleri seçer (Örn: Tavuk, Krema). <br> 3. 'Tarif Bul' butonuna basar. <br> 4. Sistem eşleşen tarifleri liste şeklinde sunar. |
| **Hata Durumu** | Uygun tarif yoksa sistem, en yakın (1 malzeme eksik) sonuçları önerir. |

---

## 6. Teknik Teslim Edilecekler (Deliverables)

1.  **Analiz Dokümanı:** (Bu dosya)
2.  **Veritabanı Şeması:** Tablo ilişkilerini gösteren ER Diyagramı.
3.  **Prototip:** Figma veya benzeri bir araçla hazırlanmış ekran tasarımları.
4.  **Kaynak Kodlar:** GitHub üzerinde tutulan Frontend ve Backend kodları.

# 🎨 UI/UX Wireframe Tasarım Raporu: Akıllı Yemek Tarifi
**Hazırlayan: Emre Cansever**
Bu doküman, **Akıllı Yemek Tarifi** web uygulamasının kullanıcı deneyimi (UX) stratejilerini ve arayüz (UI) mimarisini detaylandırmaktadır. 

---

## 1. Tasarım Vizyonu ve Hedefler
Uygulamanın temel amacı, kullanıcının mutfaktaki malzemeleri en verimli şekilde değerlendirmesini sağlamaktır. Tasarımda **"Hızlı Erişim"** ve **"Mutfak Dostu Arayüz"** prensipleri benimsenmiştir.

* **Sadelik:** Karmaşık menüler yerine doğrudan sonuca odaklanan arama yapısı.
* **Dinamizm:** Malzeme eklendikçe anlık güncellenen sonuçlar.
* **Mobil Öncelikli (Mobile-First):** Yemek yaparken genellikle telefon kullanıldığı için dokunmatik dostu büyük butonlar.

---

## 2. Sayfa Yapıları ve Bileşenler (Wireframe Detayları)

### A. Ana Sayfa: Akıllı Arama ve Giriş
Bu ekran, uygulamanın kalbidir. Kullanıcıyı "Ne pişirsem?" sorusundan kurtarmayı hedefler.

* **Hero Bölümü:** Merkezi bir arama kutusu.
* **Malzeme Havuzu:** Kullanıcı malzeme yazdıkça (Örn: Domates, Biber) arama kutusunun altında oluşan etkileşimli "X" (kapat) butonlu etiketler.
* **CTA (Eylem) Butonu:** "Tarifleri Filtrele" butonu (Zıt renk ile vurgulanmış).

### B. Arama Sonuçları ve Filtreleme
Kullanıcının kriterlerine en uygun tariflerin listelendiği alan.

* **Yan Menü (Filtreler):** * Süre (15 dk / 30 dk / 60+ dk)
    * Zorluk (Kolay / Orta / Zor)
    * Beslenme (Vegan / Glutensiz / Keto)
* **Tarif Kartları:** Her kartta yemeğin resmi, ismi, süresi ve **"Eksik Malzeme Sayısı"** (Örn: 1 malzeme eksik) bilgisi yer alır.

### C. İnteraktif Tarif Detay Sayfası
Kullanıcının mutfaktaki rehberi.

* **Porsiyon Hesaplayıcı:** Kişi sayısı değiştirildiğinde malzeme miktarlarını (gr, adet) otomatik çarpan/bölen sistem.
* **Checklist Malzemeler:** Kullanıcı hazırladığı malzemeye tik atarak takibini yapabilir.
* **Adım Adım Talimatlar:** Büyük puntolu, göz yormayan, her adımın bir kart gibi ayrıldığı yapı.

---

## 3. Kullanıcı Akış Şeması (User Flow)

1. **Keşif:** Kullanıcı elindeki malzemeleri arama çubuğuna girer.
2. **Daraltma:** Filtreleri kullanarak "Hızlı" ve "Vejetaryen" seçeneklerini seçer.
3. **Seçim:** Listeden en uygun tarifi seçer.
4. **Uygulama:** Porsiyonu ayarlar ve adım adım talimatları izleyerek yemeği tamamlar.

---

## 4. Teknik UI Detayları
* **Renk Paleti:** İştah açıcı ve doğal tonlar (Örn: Yaprak Yeşili, Sıcak Turuncu, Arka plan için Kırık Beyaz).
* **Tipografi:** Okunabilirliği yüksek, tırnaksız (Sans-serif) yazı tipleri.
* **İkonografi:** Mutfak gereçlerini ve malzeme türlerini temsil eden minimal çizgi ikonlar.

---

## 5. Roadmap & UX Geliştirmeleri
- [ ] **Sesli Navigasyon:** Eller kirliyken "Sonraki Adım" diyerek tarif ilerletme.
- [ ] **Karanlık Mod:** Gece geç saatte yemek yapanlar için göz koruması.
- [ ] **Sosyal Paylaşım:** Hazırlanan yemeğin fotoğrafını çekip toplulukla paylaşma.  



