# 🚀 Akıllı Yemek Tarifi Web Uygulaması - Geliştirme Ortamı Kurulumu ve Doğrulama Rehberi

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
