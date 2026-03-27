# 📋 Yazılım Gereksinim Analizi Raporu: Akıllı Yemek Tarifi (Revize)
**Hazırlayan: Emre Cansever**

Bu rapor, "Akıllı Yemek Tarifi" web uygulamasının temel fonksiyonel ve fonksiyonel olmayan gereksinimlerini, kullanıcı senaryolarını ve sistem mimarisini kapsamaktadır.

---

## 1. Proje Amacı ve Kapsamı
Kullanıcıların ellerindeki mevcut malzemelere göre en uygun tarifleri bulmalarını sağlamak, gıda israfını önlemek ve kişiselleştirilmiş bir yemek pişirme deneyimi sunmaktır.

## 2. Fonksiyonel Gereksinimler (Functional Requirements)

### 2.1. Akıllı Arama ve Filtreleme
* **FR-1:** Sistem, kullanıcının girdiği birden fazla malzemeye göre veritabanında eşleşen tarifleri listelemelidir.
* **FR-2 (Kritik Malzeme Ağırlığı):** Arama algoritması, tarifin "ana malzemesi" (örn: Tavuk, Kıyma) ve "yan malzemesi" (örn: Tuz, Karabiber) ayrımını yapmalıdır. Ana malzemesi eksik olan tarifler düşük eşleşme puanı almalıdır.
* **FR-3 (Eksik Malzeme Gösterimi):** Liste ekranında "5 malzemeden 4'ü sizde var" gibi net bir geri bildirim sunulmalıdır.

### 2.2. Dinamik Porsiyon ve Miktar Yönetimi
* **FR-4 (Malzeme Odaklı Ölçekleme):** Kullanıcı elindeki malzeme miktarını girdiğinde (Örn: 2 adet yumurta), sistem tarifin porsiyonunu bu miktara göre otomatik olarak hesaplamalıdır.
* **FR-5:** Kullanıcı kişi sayısını manuel değiştirdiğinde, tüm malzeme miktarları (gr, adet, ml) JavaScript tabanlı bir fonksiyonla anlık güncellenmelidir.

### 2.3. Kullanıcı Yönetimi ve Erişim
* **FR-6 (Misafir Erişimi - Guest Mode):** Tarif arama, filtreleme ve detay görüntüleme işlemleri için kayıt olma zorunluluğu bulunmamalıdır.
* **FR-7 (Yetkilendirilmiş Özellikler):** Favorilere ekleme, özel beslenme profili (Vegan, Çölyak vb.) oluşturma ve alışveriş listesi kaydetme özellikleri için üyelik girişi zorunlu tutulmalıdır.

---

## 3. Kullanıcı Deneyimi (UX) Gereksinimleri
* **UX-1:** Tarif adımları, mutfak ortamında kolay okunabilmesi için büyük puntolu ve "Checklist" (onay kutusu) yapısında olmalıdır.
* **UX-2:** Eksik malzemelerin yanında, tek tıkla "Alışveriş Listesine Ekle" butonu bulunmalıdır.
* **UX-3:** Uygulama, mobil cihazlarda "Responsive" (duyarlı) çalışmalı; tek el kullanımına uygun buton yerleşimine sahip olmalıdır.

---

## 4. Teknik Kısıtlamalar ve Standartlar
* **Veritabanı:** İlişkisel veritabanı (SQL) kullanılarak Malzeme-Tarif ilişkisi (Many-to-Many) normalize edilmelidir.
* **Güvenlik:** Kullanıcı şifreleri hashing yöntemiyle saklanmalı; API uç noktaları yetkisiz erişime karşı korunmalıdır.

---

## 5. Başarı Kriterleri (KPIs)
* Kullanıcının minimum 3 malzeme girişi ile 2 saniyenin altında sonuç alması.
* Yanlış porsiyon hesaplamalarından kaynaklanan hataların sıfıra indirilmesi.



# 📑 Proje Planlama ve Tasarım Raporu: Akıllı Yemek Tarifi
**Hazırlayan: Emre Cansever**

Bu doküman, projenin teknik gereksinimlerini ve kullanıcı deneyimi (UX) stratejilerini tek bir çatıda birleştiren kapsamlı bir analiz raporudur.

---

## 📋 1. Yazılım Gereksinim Analizi (Revize)

### 1.1. Proje Amacı
Kullanıcıların ellerindeki malzemelere göre en uygun tarifleri bulmalarını sağlayarak gıda israfını önlemek ve mutfak süreçlerini dijitalleştirmek.

### 1.2. Fonksiyonel Gereksinimler
* **FR-1 (Kritik Malzeme Ağırlıklı Arama):** Arama algoritması, tarifin "ana malzemesi" (örn: Et, Tavuk) ve "yan malzemesi" (örn: Baharat, Su) ayrımını yapmalıdır. Ana malzemesi eksik olan tarifler düşük eşleşme puanı almalıdır.
* **FR-2 (Dinamik Porsiyon Ölçekleme):** Kullanıcı elindeki malzeme miktarını girdiğinde (Örn: 2 yumurta), sistem tarifin porsiyonunu bu miktara göre otomatik önermeli ve tüm içerik miktarlarını (gr, ml) anlık güncellemelidir.
* **FR-3 (Misafir Erişimi - Guest Mode):** Tarif arama, filtreleme ve detay görüntüleme işlemleri için kayıt olma zorunluluğu bulunmamalıdır. Hızlı erişim önceliklidir.
* **FR-4 (Yetkilendirilmiş Özellikler):** Favorilere ekleme, özel beslenme profili (Vegan, Glutensiz vb.) ve alışveriş listesi kaydı için üyelik girişi zorunlu tutulmalıdır.

### 1.3. Fonksiyonel Olmayan Gereksinimler
* **Hız:** Arama sonuçları 2 saniyenin altında listelenmelidir.
* **Responsive:** Uygulama, mobil cihazlarda ve tabletlerde %100 uyumlu (responsive) çalışmalıdır.

---

## 🎨 2. UI/UX Wireframe ve Tasarım Stratejisi

### 2.1. Tasarım Vizyonu
Mutfak ortamında (genellikle mobil cihazdan ve eller doluyken) kullanım kolaylığı sağlamak adına **"Minimalist ve İşlevsel"** bir arayüz hedeflenmiştir.

### 2.2. Ekran Yapıları (Wireframe Detayları)

#### A. Ana Sayfa (Akıllı Filtreleme)
* **Merkezi Arama Barı:** "Dolabında ne var?" odaklı, malzeme eklendikçe dinamik etiketler (tags) oluşturan yapı.
* **Hızlı Başlangıç:** Giriş yapmadan doğrudan malzeme girip "Tarif Bul" butonuna erişim (Guest Mode).

#### B. Arama Sonuçları ve Eşleşme Oranı
* **Eksik Malzeme Gösterimi:** Kart tasarımlarında "Sadece 1 eksiğiniz var" gibi net uyarılar.
* **Akıllı Sıralama:** Elindeki malzemelerle "Hemen Yapılabilir" olanlar en üstte, alışveriş gerektirenler en altta listelenir.

#### C. İnteraktif Tarif Detay Sayfası
* **Dinamik Miktar Hesaplayıcı:** Porsiyon sayısı (+/-) ile değiştiğinde malzemelerin gramajlarının JS ile anlık değişmesi.
* **Checklist Yapısı:** Adım adım talimatlarda, tamamlanan aşamaların üzerine tıklanarak işaretlenebilmesi (UX Odaklı).
* **Alışveriş Listesi Entegrasyonu:** Tarifteki eksik malzemelerin yanındaki "+" butonu ile doğrudan kullanıcı listesine eklenmesi.

### 2.3. Kullanıcı Akış Şeması (User Flow)
1. **Giriş:** Kullanıcı ana sayfaya gelir (Giriş yapması şart değildir).
2. **Girdi:** Elindeki 3-4 malzemeyi girer ve "Tarifleri Gör" der.
3. **Analiz:** Sistem, malzeme miktarlarına göre en uygun porsiyon sayısını önerir.
4. **Uygulama:** Kullanıcı tarifi checklist ile takip eder; eksik baharatı varsa "Alışveriş Listeme Ekle" butonunu kullanır (Burada Login istenir).

---

## 🚀 3. Gelecek Geliştirmeler (Roadmap)
- [ ] **Sesli Komut:** Yemek yaparken adımlar arası "Sonraki" komutuyla geçiş.
- [ ] **Dark Mode:** Akşam yemek hazırlayanlar için göz yormayan arayüz.
