# "Akıllı Yemek Tarifi Uygulaması" - Proje Akışı ve Haftalık İlerleme

Bu dosya, "Akıllı Yemek Tarifi" takımının haftalık proje ilerlemesini ve üyelerin görev dağılımlarını içermektedir.

## 1. Hafta (9-12 Mart)
* **Mehmet Furkan (Yönetici):** GitHub reposu oluşturuldu, branch koruma kuralları (main) ayarlandı. Proje akış dokümanı oluşturuldu. Teknoloji araştırması ve seçimi gerçekleştirildi.
* **Emre Cansever:** Proje için detaylı Gereksinim Analizi raporu oluşturuldu.
* **Muhammed Ali Yücesu:** Ekip için Geliştirme Ortamı Kurulumu ve Doğrulama Rehberi dokümantasyonu hazırlandı.
* **Emine Zehra Duyar :** Proje Analizi ve Tanımlama raporu oluşturuldu.
* **[Ekip Arkadaşının Adı]:** [Bu hafta ne yapıldığı buraya yazılacak]



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

# Yazılım Gereksinim Spesifikasyonu (SRS)

## 1. Proje Genel Bakışı
**Proje Adı:** Akıllı Mutfak ve Kişiselleştirilmiş Yemek Planlayıcı  
**Hazırlayan:** Emre Cansever 
**Tarih:** 9 Mart 2026  
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



# Teknoloji Araştırması ve Seçimi Raporu

**Sorumlu:** Mehmet Furkan Akyar | Tarih: 12 Mart 2026 Perşembe

## 1. Giriş
Bu rapor, kullanıcıların ellerindeki malzemelere göre tarif önerileri sunan ve kişiselleştirilmiş yemek planları oluşturabilen web uygulamamızın temel altyapısını belirlemek amacıyla hazırlanmıştır. Projemizin temel teslimatları olan kullanıcı kayıt sistemi, tarif arama/filtreleme, kişiselleştirilmiş öneri motoru ve mobil uyumlu arayüz gereksinimleri göz önünde bulundurularak çeşitli teknolojiler analiz edilmiştir.

## 2. Frontend Teknolojileri Analizi
Kullanıcı ile doğrudan etkileşime girecek, mobil uyumlu ve dinamik arayüzü oluşturmak için modern JavaScript kütüphaneleri değerlendirilmiştir.

### Seçenek 1: React

**Avantajları:** Bileşen (component) tabanlı mimarisi sayesinde kod tekrarını önler ve yönetimi kolaylaştırır. Virtual DOM yapısı ile performansı yüksektir. Zengin bir kütüphane ekosistemine sahiptir. Mobil uyumlu arayüzler geliştirmek için esnek bir yapı sunar.

**Dezavantajları:** Sadece bir kütüphane olduğu için state management (Redux vb.) ve routing işlemleri için ek paketlere ihtiyaç duyar.

### Seçenek 2: Vue.js

**Avantajları:** Öğrenme eğrisi React'a göre daha düşüktür. Dokümantasyonu çok başarılıdır.

**Dezavantajları:** React kadar büyük bir kurumsal desteğe ve ekosisteme sahip değildir.

**Karar:** Projemizin ölçeklenebilirliği ve ekip içi uyumu göz önüne alındığında, grubumuzda da daha önce belirlenen React tercih edilmiştir.

## 3. Backend Teknolojileri Analizi
Kullanıcı kayıt ve giriş sistemi, tarif arama ve filtreleme algoritmaları arka planda çalışacak güçlü bir sunucu altyapısı gerektirmektedir.

### Seçenek 1: Node.js ve Express

**Avantajları:** JavaScript tabanlı olması sayesinde frontend (React) ile aynı dil kullanılarak tam yığın (full-stack) uyumu sağlanır. Asenkron ve olay güdümlü (event-driven) yapısı ile yüksek eşzamanlı istekleri hızlı bir şekilde işler. Express kütüphanesi ile hızlıca RESTful API'ler oluşturulabilir.

**Dezavantajları:** CPU yoğunluklu işlemlerde (örneğin çok karmaşık veri analizleri) tek iş parçacıklı (single-threaded) yapısı nedeniyle performans düşüşü yaşayabilir.

### Seçenek 2: Java Spring Boot

**Avantajları:** Nesne yönelimli programlama prensiplerini mükemmel uygular. Çok iş parçacıklı (multi-threaded) yapısı ile sağlam ve kurumsal çapta güvenli bir mimari sunar.

**Dezavantajları:** Kurulumu ve konfigürasyonu Node.js'e kıyasla daha ağırdır. Hızlı prototipleme süreçlerinde zaman kaybettirebilir.

**Karar:** Projenin hızlı bir şekilde MVP (Minimum Viable Product) aşamasına getirilmesi hedeflendiğinden ve JavaScript ekosisteminin bütünlüğünden faydalanmak adına Node.js ve Express seçilmiştir. Kişiselleştirilmiş öneri motorunun karmaşıklığı artarsa, ilerleyen aşamalarda Python tabanlı mikro servisler eklenebilir.

## 4. Veritabanı Teknolojileri Analizi
Tarifler, kullanıcı profilleri ve malzeme listelerinin saklanması için uygun veri modeli seçilmelidir.

### Seçenek 1: MongoDB (NoSQL)

**Avantajları:** Doküman tabanlı ve şemasız (schema-less) yapısı, esnek bir veri modeli sunar. Özellikle yemek tarifleri gibi içerisinde farklı sayılarda malzeme, adım ve etiket barındıran düzensiz verileri JSON formatında tutmak için idealdir.

**Dezavantajları:** Karmaşık ilişkisel sorgularda (JOIN işlemleri) SQL veritabanlarına göre daha hantaldır.

### Seçenek 2: PostgreSQL (SQL)

**Avantajları:** Veri bütünlüğü ve katı şema yapısı sunar. Karmaşık ilişkileri yönetmekte çok başarılıdır.

**Dezavantajları:** Yemek tariflerinin değişken yapısını tablolar halinde modellemek zorlayıcı olabilir ve çok sayıda tablo birleşimi gerektirebilir.

**Karar:** Yemek tariflerinin hiyerarşik doğası ve kişiselleştirilmiş öneri motoru için gerekli kullanıcı verilerinin esnek bir şekilde tutulabilmesi avantajıyla MongoDB tercih edilmiştir.

## 5. Sonuç ve Teknoloji Yığını (Stack)
Yapılan araştırmalar ve karşılaştırmalı değerlendirmeler sonucunda; projenin geliştirme hızı, performansı ve esnekliği göz önüne alınarak MERN (MongoDB, Express, React, Node.js) yığınının kullanılmasına karar verilmiştir. Bu mimari, kullanıcı senaryolarımızı karşılayacak optimum esnekliği ve hızı sağlayacaktır.




# 🚀 Akıllı Yemek Tarifi Web Uygulaması - Geliştirme Ortamı Kurulumu ve Doğrulama Rehberi

**Hazırlayan:** Muhammed Ali Yücesu | **Tarih:** 10 Mart 2026

Bu doküman, proje geliştirme sürecinde kullanılacak temel yazılım araçlarının kurulumu ve doğrulama adımlarını içermektedir. Projede tüm ekip üyelerinin ortak ve sorunsuz bir geliştirme ortamında çalışabilmesi için aşağıdaki adımların eksiksiz şekilde tamamlanması gerekmektedir.

## 🎯 Amaç
Bu rehberin amacı, proje ekibinin ortak bir geliştirme ortamında çalışmasını sağlamak, gerekli araçları standart hale getirmek ve kurulumun doğrulanmasına yardımcı olmaktır.

---

## 🛠 Gerekli Kurulumlar
Projeyi MERN Stack (MongoDB, Express, React, Node.js) ile geliştireceğimiz için aşağıdaki araçların bilgisayarda kurulu olması gerekmektedir.

### A. Kod Editörü: Visual Studio Code (VS Code)
Projeyi yazarken ortak bir standartta kalmak için VS Code kullanılacaktır.
* **İndirme Linki:** [Visual Studio Code](https://code.visualstudio.com/)
* Kurulum varsayılan ayarlarla yapılabilir.

### B. Çalışma Ortamı: Node.js
Projenin hem frontend hem de backend tarafını çalıştırabilmek için Node.js kurulu olmalıdır. Bu kurulumla birlikte `npm` de otomatik olarak yüklenecektir.
* **İndirme Linki:** [Node.js](https://nodejs.org/)
* **Önemli:** LTS (Long Term Support) sürümü tercih edilmelidir.

### C. Versiyon Kontrol Sistemi: Git
Proje dosyalarının sürüm kontrolünü sağlamak ve GitHub ile senkronize çalışmak için Git kurulmalıdır.
* **İndirme Linki:** [Git](https://git-scm.com/downloads)
* Windows kullanıcıları standart kurulumu takip edebilir.
* Mac kullanıcıları terminale `git --version` yazarak kontrol sağlayabilir.

### D. API Test Aracı: Postman
Backend tarafında geliştirilecek API’lerin test edilmesi için Postman kullanılacaktır.
* **İndirme Linki:** [Postman](https://www.postman.com/downloads/)

### E. Veritabanı Aracı: MongoDB / MongoDB Compass
Projede veritabanı işlemleri için MongoDB kullanılacaktır. Veritabanını görsel olarak yönetmek için MongoDB Compass kurulması önerilir.
* **İndirme Linki:** [MongoDB Community Server](https://www.mongodb.com/try/download/community)
* **İndirme Linki:** [MongoDB Compass](https://www.mongodb.com/try/download/compass)

### F. GitHub Hesabı
Proje dosyaları GitHub üzerinde paylaşılacağı için tüm ekip üyelerinin aktif bir GitHub hesabına sahip olması gerekmektedir.

---

## 🔌 Önerilen VS Code Eklentileri
VS Code kurulduktan sonra aşağıdaki eklentilerin yüklenmesi önerilir:
* **Prettier - Code formatter:** Kodları düzenli hale getirir.
* **ESLint:** JavaScript hatalarını tespit eder.
* **ES7+ React/Redux/React-Native snippets:** React geliştirme sürecini hızlandırır.

---

## ✅ Kurulumları Doğrulama
Kurulum işlemleri tamamlandıktan sonra terminal (veya Command Prompt/PowerShell) açılarak aşağıdaki komutlar çalıştırılmalıdır:

```bash
node -v
npm -v
git --version
```

### Beklenen Sonuçlar
* `node -v` komutu Node.js sürüm bilgisini göstermelidir.
* `npm -v` komutu npm sürüm bilgisini göstermelidir.
* `git --version` komutu Git sürüm bilgisini göstermelidir.

> **Not:** Bu komutlardan herhangi biri hata verirse ilgili kurulum adımı tekrar kontrol edilmelidir.

---

## 2. Hafta
*(İlerleyen haftalarda doldurulacak)*


