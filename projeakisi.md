# "Akıllı Yemek Tarifi Uygulaması" - Proje Akışı ve Haftalık İlerleme

Bu dosya, "Akıllı Yemek Tarifi" takımının haftalık proje ilerlemesini ve üyelerin görev dağılımlarını içermektedir.

## 1. Hafta (9-12 Mart)
* **Mehmet Furkan (Yönetici):** GitHub reposu oluşturuldu, branch koruma kuralları (main) ayarlandı. Proje akış dokümanı oluşturuldu.
* **[Ekip Arkadaşının Adı]:** [Bu hafta ne yapıldığı buraya yazılacak]
* **[Ekip Arkadaşının Adı]:** [Bu hafta ne yapıldığı buraya yazılacak]
* **[Ekip Arkadaşının Adı]:** [Bu hafta ne yapıldığı buraya yazılacak]
* **[Ekip Arkadaşının Adı]:** [Bu hafta ne yapıldığı buraya yazılacak]

# Akıllı Yemek Tarifi Web Uygulaması
**Görev:** Teknoloji Araştırması ve Seçimi Raporu

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


## 2. Hafta
*(İlerleyen haftalarda doldurulacak)*


