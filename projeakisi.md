# "Akıllı Yemek Tarifi Uygulaması" - Proje Akışı ve Haftalık İlerleme

Bu dosya, "Akıllı Yemek Tarifi" takımının haftalık proje ilerlemesini ve üyelerin görev dağılımlarını içermektedir.

## 1. Hafta (9-12 Mart)
* **Mehmet Furkan (Yönetici):** GitHub reposu oluşturuldu, branch koruma kuralları (main) ayarlandı. Proje akış dokümanı oluşturuldu.
* **Emre Cansever:** Proje için detaylı Gereksinim Analizi raporu oluşturuldu.
* **[Ekip Arkadaşının Adı]:** [Bu hafta ne yapıldığı buraya yazılacak]
* **[Ekip Arkadaşının Adı]:** [Bu hafta ne yapıldığı buraya yazılacak]
* **[Ekip Arkadaşının Adı]:** [Bu hafta ne yapıldığı buraya yazılacak]

**YAZILIM GEREKSİNİM ANALİZİ DÖKÜMANI (SRS)**
**Proje Adı:** Akıllı Mutfak ve Kişiselleştirilmiş Yemek Planlayıcı

**Hazırlayan:** Emre Cansever

**Tarih:** 9 Mart 2026

**Kapsam:** Web Uygulaması

**1. GİRİŞ**
Bu döküman, kullanıcıların ellerindeki malzemelere göre yemek tarifi bulmalarını sağlayan ve kişisel beslenme tercihlerine göre haftalık planlar oluşturan web uygulamasının fonksiyonel ve fonksiyonel olmayan gereksinimlerini tanımlar.

**2. FONKSİYONEL GEREKSİNİMLER (Functional Requirements)**
Sistemin kullanıcıya sunacağı temel yetenekler şunlardır:

**2.1. Kullanıcı ve Profil Yönetimi**
**FR-1:** Sistem; e-posta ve şifre ile kayıt olma, giriş yapma ve çıkış yapma özelliklerini sunmalıdır.

**FR-2:** Kullanıcılar profillerinde diyet tercihlerini (Vegan, Vejetaryen, Keto vb.) ve alerjen bilgilerini (Gluten, Yer fıstığı vb.) tanımlayabilmelidir.

**2.2.** **Malzeme ve Tarif Yönetimi**
**FR-3:** Kullanıcılar ellerindeki malzemeleri sisteme metin veya liste seçimi ile girebilmelidir.

**FR-4:** Sistem, girilen malzemelere göre en yüksek eşleşme oranına sahip tarifleri öncelikli olarak listelemelidir.

**FR-5:** Kullanıcılar tarifleri; hazırlama süresi, kalori değeri ve mutfak türüne göre filtreleyebilmelidir.

**2.3. Kişiselleştirilmiş Öneri ve Planlama**
**FR-6:** Öneri motoru, kullanıcının geçmiş aramaları ve diyet tercihlerine göre "Günün Tarifi" önerisinde bulunmalıdır.

**FR-7:** Kullanıcılar seçtikleri tarifleri takvim üzerinde belirli gün ve öğünlere (Sabah, Öğle, Akşam) atayarak yemek planı oluşturabilmelidir.

**3. FONKSİYONEL OLMAYAN GEREKSİNİMLER (Non-Functional Requirements)**
Sistemin kalite ve performans standartları şunlardır:

**NFR-1 (Performans):** Malzeme eşleştirme sorguları 1.5 saniyenin altında sonuç üretmelidir.

**NFR-2 (Kullanılabilirlik):** Arayüz "Mobile-First" yaklaşımıyla tasarlanmalı ve tüm ekran boyutlarında (Responsive) sorunsuz çalışmalıdır.

**NFR-3 (Güvenlik):** Kullanıcı verileri KVKK standartlarına uygun işlenmeli, şifreler "salt" edilerek hashlenmiş şekilde saklanmalıdır.

**NFR-4 (Erişilebilirlik):** Sistem, görme engelli kullanıcılar için ekran okuyucu uyumlu (ARIA etiketleri kullanılarak) olmalıdır.

**4. KULLANICI HİKAYELERİ (User Stories)**
Gereksinimlerin işlevselliğini doğrulamak için belirlenen senaryolar:

**Hikaye 1:** Bir üniversite öğrencisi olarak, elimdeki kısıtlı malzemeleri sisteme girip 15 dakika içinde yapabileceğim tarifleri görmek istiyorum, böylece zaman kazanabilirim.

**Hikaye 2:** Çölyak hastası bir kullanıcı olarak, arama sonuçlarımda glutensiz tariflerin otomatik filtrelenmesini istiyorum, böylece sağlığımı riske atmam.

**Hikaye 3:** Yoğun çalışan bir profesyonel olarak, Pazar gününden tüm haftanın yemek listesini oluşturmak istiyorum, böylece hafta içi alışveriş ve yemek düşünmekle vakit kaybetmem.

| **Senaryo Adı** | **Malzemeye Göre Tarif Arama** |
| :--- | :--- |
| **Aktör** | Standart Kullanıcı |
| **Ön Koşul** | Kullanıcının sisteme giriş yapmış olması. |
| **Ana Akış** | 1. Kullanıcı malzeme giriş alanına gider. <br> 2. "Domates, Tavuk, Krema" seçer. <br> 3. Sistem veritabanında en uygun tarifleri tarar. <br> 4. Eşleşen tarifler başarı yüzdesiyle listelenir. |
| **Hata Durumu** | Eşleşen tarif yoksa, sistem "en yakın eksik malzemeli" tarifleri önerir. | 

**6. TEKNİK TESLİMATLAR (Deliverables)**
Proje sonunda sunulacak dökümanlar:

*1.Frontend (React/Vue) ve Backend (Node.js/Spring Boot) kaynak kodları.*

*2.Veritabanı Şeması (ER Diyagramı).*

*3.API Dokümantasyonu (Swagger/Postman).*

## 2. Hafta
*(İlerleyen haftalarda doldurulacak)*


