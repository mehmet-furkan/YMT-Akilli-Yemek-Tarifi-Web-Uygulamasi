# "Akıllı Yemek Tarifi Uygulaması" - Proje Akışı ve Haftalık İlerleme

Bu dosya, "Akıllı Yemek Tarifi" takımının haftalık proje ilerlemesini ve üyelerin görev dağılımlarını içermektedir.

## 1. Hafta (9-12 Mart)
* **Mehmet Furkan (Yönetici):** GitHub reposu oluşturuldu, branch koruma kuralları (main) ayarlandı. Proje akış dokümanı oluşturuldu.
* **Emre Cansever:** Proje için detaylı Gereksinim Analizi raporu oluşturuldu.
* **[Ekip Arkadaşının Adı]:** [Bu hafta ne yapıldığı buraya yazılacak]
* **[Ekip Arkadaşının Adı]:** [Bu hafta ne yapıldığı buraya yazılacak]
* **[Ekip Arkadaşının Adı]:** [Bu hafta ne yapıldığı buraya yazılacak]

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

## 2. Hafta
*(İlerleyen haftalarda doldurulacak)*


