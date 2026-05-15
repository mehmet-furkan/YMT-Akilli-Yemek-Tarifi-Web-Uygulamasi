import "dotenv/config";
import mongoose from "mongoose";

const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Favorite = require("../models/Favorite");
const MealPlan = require("../models/MealPlan");

const URI = process.env.MONGO_URI || "mongodb://localhost:27017/ymt-akilli-yemek";

// Kısa yardımcı fonksiyonlar
const ing = (name: string, amount: string, unit = "") => ({ name, amount, unit });
const rec = (
  title: string, description: string, category: string, difficulty: string,
  cookTime: number, prepTime: number, servings: number, tags: string[],
  ingredients: any[], instructions: string[], createdBy: any
) => ({ title, description, category, difficulty, cookTime, prepTime, servings, tags, ingredients, instructions, createdBy });

async function seed() {
  await mongoose.connect(URI);
  console.log("✅ MongoDB bağlandı");

  // Eski veriyi sil
  await Promise.all([
    User.deleteMany({}),
    Recipe.deleteMany({}),
    Favorite.deleteMany({}),
    MealPlan.deleteMany({}),
  ]);
  console.log("🗑️  Eski veriler silindi");

  // 5 Kullanıcı
  const users = await User.create([
    { name: "Zehra Kaya",    email: "zehra@test.com",   password: "Test1234", dietaryPreferences: ["Vejeteryan"] },
    { name: "Ahmet Yılmaz", email: "ahmet@test.com",   password: "Test1234", dietaryPreferences: [] },
    { name: "Fatma Demir",  email: "fatma@test.com",   password: "Test1234", dietaryPreferences: ["Vegan"] },
    { name: "Mehmet Şahin", email: "mehmet@test.com",  password: "Test1234", dietaryPreferences: ["Glutensiz"] },
    { name: "Ayşe Çelik",  email: "ayse@test.com",    password: "Test1234", dietaryPreferences: ["Laktozsuz"] },
  ]);

  const u0 = users[0]._id;
  const u1 = users[1]._id;
  const u2 = users[2]._id;

  // 30 Tarif
  const recipes = await Recipe.create([
    // --- KAHVALTI (5) ---
    rec("Menemen", "Klasik Türk kahvaltısı.", "Kahvaltı", "Kolay", 15, 5, 2,
      ["kahvaltı", "yumurta"],
      [ing("domates","3","adet"), ing("yumurta","3","adet"), ing("yeşil biber","2","adet"), ing("sıvıyağ","1","yemek kaşığı")],
      ["Domatesleri küp doğra.", "Biberleri yağda kavur, domates ekle.", "Yumurtaları kır, karıştırarak pişir."], u0),

    rec("Poğaça", "Fırında çıtır poğaça.", "Kahvaltı", "Orta", 25, 30, 8,
      ["fırın", "hamur"],
      [ing("un","3","su bardağı"), ing("yoğurt","1","su bardağı"), ing("yumurta","2","adet"), ing("peynir","150","gram")],
      ["Un, yoğurt ve yumurtayı yoğur.", "İçine peynir koy, şekillendir.", "180°C fırında 25 dakika pişir."], u0),

    rec("Kaygana", "Mısır unlu geleneksel omlet.", "Kahvaltı", "Kolay", 10, 5, 2,
      ["kahvaltı", "mısır"],
      [ing("mısır unu","2","yemek kaşığı"), ing("yumurta","2","adet"), ing("süt","50","ml")],
      ["Malzemeleri çırp.", "Kızgın tavaya dök.", "Her iki tarafı pişir."], u0),

    rec("Peynirli Omlet", "Hızlı ve doyurucu kahvaltı.", "Kahvaltı", "Kolay", 8, 2, 1,
      ["hızlı", "peynir"],
      [ing("yumurta","3","adet"), ing("kaşar peyniri","50","gram"), ing("tereyağı","1","tatlı kaşığı")],
      ["Yumurtaları çırp.", "Tereyağında pişir.", "Peyniri ekleyip kapat."], u0),

    rec("Çılbır", "Sirkeli suda pişmiş yumurta.", "Kahvaltı", "Orta", 10, 5, 2,
      ["klasik", "yumurta"],
      [ing("yumurta","2","adet"), ing("yoğurt","3","yemek kaşığı"), ing("tereyağı","1","yemek kaşığı"), ing("pul biber","1","tatlı kaşığı")],
      ["Sirke eklenen suda yumurtayı haşla.", "Yoğurdu tabağa yay.", "Yumurtayı üstüne koy, tereyağı gezdir."], u0),

    // --- ÇORBA (5) ---
    rec("Mercimek Çorbası", "Türk mutfağının vazgeçilmezi.", "Çorba", "Kolay", 30, 10, 4,
      ["çorba", "mercimek"],
      [ing("kırmızı mercimek","1","su bardağı"), ing("soğan","1","adet"), ing("havuç","1","adet"), ing("domates salçası","1","yemek kaşığı")],
      ["Mercimeği yıka, soğan ve havuçla haşla.", "Blendırda püre yap.", "Salça ve baharatı ekle, kaynat."], u1),

    rec("Ezogelin Çorbası", "Bulgurlu besleyici çorba.", "Çorba", "Kolay", 35, 10, 4,
      ["çorba", "bulgur"],
      [ing("kırmızı mercimek","1","su bardağı"), ing("ince bulgur","2","yemek kaşığı"), ing("soğan","1","adet"), ing("nane","1","tatlı kaşığı")],
      ["Mercimek ve bulguru haşla.", "Soğanı kavur, ekle.", "Nane ve baharatla servis yap."], u1),

    rec("Yayla Çorbası", "Nefis yoğurtlu çorba.", "Çorba", "Orta", 25, 10, 4,
      ["yoğurt", "pirinç"],
      [ing("yoğurt","2","su bardağı"), ing("pirinç","3","yemek kaşığı"), ing("yumurta","1","adet"), ing("nane","1","tatlı kaşığı")],
      ["Pirinci haşla.", "Yumurta ve yoğurdu karıştır, terbiye yap.", "Çorbaya ekle, kaynatma."], u1),

    rec("Domates Çorbası", "Kremalı domates çorbası.", "Çorba", "Kolay", 20, 5, 4,
      ["domates", "kremalı"],
      [ing("domates","4","adet"), ing("soğan","1","adet"), ing("tereyağı","1","yemek kaşığı"), ing("krema","50","ml")],
      ["Domates ve soğanı pişir.", "Blendırda çek.", "Krema ekle, servis yap."], u2),

    rec("Tarhana Çorbası", "Fermente tarhana ile çorba.", "Çorba", "Kolay", 20, 5, 4,
      ["tarhana", "geleneksel"],
      [ing("tarhana","3","yemek kaşığı"), ing("domates salçası","1","yemek kaşığı"), ing("tereyağı","1","yemek kaşığı")],
      ["Tarhanayı ılık suda beklet.", "Salça ve suyla kaynat.", "Tereyağı ile servis yap."], u2),

    // --- ANA YEMEK (10) ---
    rec("Kuru Fasulye", "Türk mutfağının klasiği.", "Ana Yemek", "Kolay", 60, 480, 4,
      ["baklagil", "klasik"],
      [ing("kuru fasulye","2","su bardağı"), ing("soğan","1","adet"), ing("domates salçası","2","yemek kaşığı"), ing("sıvıyağ","2","yemek kaşığı")],
      ["Fasulyeleri bir gece ıslatıp haşla.", "Soğanı kavur, salça ekle.", "Fasulyeleri ekle, pişir."], u0),

    rec("Mantı", "El yapımı Türk mantısı.", "Ana Yemek", "Zor", 60, 60, 4,
      ["hamur", "geleneksel"],
      [ing("un","2","su bardağı"), ing("kıyma","250","gram"), ing("soğan","1","adet"), ing("yoğurt","1","su bardağı")],
      ["Hamuru yoğur, açıp kare kes.", "Kıymalı iç harca koy, kapat.", "Suda haşla, yoğurt ve tereyağıyla servis yap."], u0),

    rec("İmam Bayıldı", "Zeytinyağlı patlıcan yemeği.", "Ana Yemek", "Orta", 50, 15, 4,
      ["patlıcan", "zeytinyağlı"],
      [ing("patlıcan","3","adet"), ing("soğan","2","adet"), ing("domates","2","adet"), ing("zeytinyağı","4","yemek kaşığı")],
      ["Patlıcanları ortadan yar, tuzla.", "Soğan ve domatesi kavur.", "Patlıcanları doldur, fırınla."], u1),

    rec("Karnıyarık", "Kıymalı patlıcan yemeği.", "Ana Yemek", "Orta", 50, 20, 4,
      ["patlıcan", "kıyma"],
      [ing("patlıcan","4","adet"), ing("kıyma","200","gram"), ing("domates","2","adet"), ing("soğan","1","adet")],
      ["Patlıcanları kızart.", "Kıyma harcını hazırla.", "Doldurup fırında pişir."], u1),

    rec("Köfte", "Izgara Türk köftesi.", "Ana Yemek", "Kolay", 20, 15, 4,
      ["et", "ızgara"],
      [ing("kıyma","400","gram"), ing("soğan","1","adet"), ing("ekmek içi","1","dilim"), ing("baharatlar","1","tatlı kaşığı")],
      ["Kıymayı baharatlarla yoğur.", "Şekil ver.", "Izgarada pişir."], u0),

    rec("Tavuk Sote", "Sebzeli tavuk sote.", "Ana Yemek", "Kolay", 25, 10, 4,
      ["tavuk", "sote"],
      [ing("tavuk göğsü","400","gram"), ing("biber","2","adet"), ing("soğan","1","adet"), ing("domates salçası","1","yemek kaşığı")],
      ["Tavuğu küp kes.", "Soğan ve biberi kavur.", "Tavuğu ekle, salçayla pişir."], u0),

    rec("Pilav", "Tereyağlı Türk pilavı.", "Ana Yemek", "Kolay", 20, 5, 4,
      ["pirinç", "temel"],
      [ing("pirinç","2","su bardağı"), ing("tereyağı","2","yemek kaşığı"), ing("su","3","su bardağı"), ing("tuz","1","tatlı kaşığı")],
      ["Pirinci yıka.", "Tereyağında kavur.", "Su ekle, kapağı kapat, dem al."], u2),

    rec("Nohutlu Yemek", "Bütün nohut yemeği.", "Ana Yemek", "Kolay", 45, 480, 4,
      ["nohut", "baklagil"],
      [ing("nohut","2","su bardağı"), ing("soğan","1","adet"), ing("domates salçası","1","yemek kaşığı"), ing("sıvıyağ","2","yemek kaşığı")],
      ["Nohutu ıslatıp haşla.", "Soğan ve salçayı kavur.", "Nohutla pişir."], u2),

    rec("Bezelye Yemeği", "Zeytinyağlı bezelye.", "Ana Yemek", "Kolay", 30, 10, 4,
      ["sebze", "zeytinyağlı"],
      [ing("bezelye","400","gram"), ing("havuç","1","adet"), ing("soğan","1","adet"), ing("zeytinyağı","2","yemek kaşığı")],
      ["Soğan ve havucu kavur.", "Bezelye ekle.", "Suyla pişir."], u2),

    rec("Döner Tavuk", "Tavuklu döner tabak.", "Ana Yemek", "Orta", 30, 120, 4,
      ["tavuk", "döner"],
      [ing("tavuk but","500","gram"), ing("yoğurt","3","yemek kaşığı"), ing("zeytinyağı","2","yemek kaşığı"), ing("pul biber","1","tatlı kaşığı")],
      ["Tavuğu marine et.", "Şişe diz, fırınla.", "Yufka ile servis yap."], u1),

    // --- SALATA (4) ---
    rec("Çoban Salatası", "Taze sebze salatası.", "Salata", "Kolay", 0, 10, 4,
      ["taze", "salata"],
      [ing("domates","2","adet"), ing("salatalık","1","adet"), ing("soğan","1","adet"), ing("zeytinyağı","2","yemek kaşığı")],
      ["Sebzeleri küp doğra.", "Zeytinyağı ve limon sık.", "Karıştır, servis yap."], u0),

    rec("Semizotu Salatası", "Yoğurtlu semizotu.", "Salata", "Kolay", 0, 10, 2,
      ["yoğurt", "ot"],
      [ing("semizotu","200","gram"), ing("yoğurt","3","yemek kaşığı"), ing("sarımsak","1","diş")],
      ["Semizotunu yıka, doğra.", "Sarımsaklı yoğurdu hazırla.", "Karıştır."], u1),

    rec("Patlıcan Salatası", "Közlenmiş patlıcan salatası.", "Salata", "Orta", 20, 10, 4,
      ["patlıcan", "közlenmiş"],
      [ing("patlıcan","2","adet"), ing("sarımsak","2","diş"), ing("zeytinyağı","2","yemek kaşığı"), ing("limon","1","adet")],
      ["Patlıcanı közle.", "Kabuğunu soy, ezin.", "Sarımsak ve limonla karıştır."], u2),

    rec("Mevsim Salatası", "Karışık yeşil salata.", "Salata", "Kolay", 0, 10, 4,
      ["yeşil", "mevsim"],
      [ing("marul","1","baş"), ing("roka","50","gram"), ing("kiraz domates","10","adet"), ing("zeytinyağı","2","yemek kaşığı")],
      ["Yeşillikleri yıka.", "Domatesleri ekle.", "Zeytinyağıyla karıştır."], u0),

    // --- TATLI (4) ---
    rec("Baklava", "Geleneksel fıstıklı baklava.", "Tatlı", "Zor", 60, 60, 12,
      ["tatlı", "fıstık"],
      [ing("yufka","20","yaprak"), ing("tereyağı","200","gram"), ing("fıstık","200","gram"), ing("şeker","2","su bardağı")],
      ["Yufkaları tereyağıyla kat kat diz.", "Fıstığı ortaya koy.", "Pişir, şerbeti dök."], u0),

    rec("Sütlaç", "Fırında sütlaç.", "Tatlı", "Kolay", 30, 15, 6,
      ["süt", "pirinç"],
      [ing("süt","1","litre"), ing("pirinç","4","yemek kaşığı"), ing("şeker","5","yemek kaşığı"), ing("nişasta","1","yemek kaşığı")],
      ["Pirinç ve sütü kaynat.", "Şeker ve nişasta ekle.", "Fırında üzeri kızarana dek pişir."], u1),

    rec("Kazandibi", "Yanık dibli sütlü tatlı.", "Tatlı", "Orta", 40, 15, 6,
      ["süt", "nişasta"],
      [ing("süt","1","litre"), ing("şeker","5","yemek kaşığı"), ing("nişasta","3","yemek kaşığı"), ing("tavuk göğsü","50","gram")],
      ["Sütü şeker ve nişastayla kaynat.", "Tavuğu çekip ekle.", "Tepsiye dök, altı yanana dek pişir."], u2),

    rec("Aşure", "40 malzemenin buluşması.", "Tatlı", "Orta", 120, 480, 12,
      ["geleneksel", "buğday"],
      [ing("aşurelik buğday","1","su bardağı"), ing("nohut","½","su bardağı"), ing("kuru üzüm","3","yemek kaşığı"), ing("şeker","1","su bardağı")],
      ["Buğday ve nohutları haşla.", "Şeker ve kuruyemişleri ekle.", "Kaselere dök, cevizle süsle."], u0),

    // --- İÇECEK (2) ---
    rec("Ayran", "Soğuk tuzlu yoğurt içeceği.", "İçecek", "Kolay", 0, 5, 4,
      ["yoğurt", "serin"],
      [ing("yoğurt","2","su bardağı"), ing("soğuk su","1","su bardağı"), ing("tuz","1","çimdik")],
      ["Yoğurt ve suyu karıştır.", "Tuz ekle.", "Köpürene dek çırp, servis yap."], u1),

    rec("Türk Kahvesi", "Cezve kahvesi.", "İçecek", "Orta", 5, 2, 2,
      ["kahve", "geleneksel"],
      [ing("Türk kahvesi","2","tatlı kaşığı"), ing("su","2","fincan"), ing("şeker","1","tatlı kaşığı")],
      ["Su ve kahveyi cezveye koy.", "Kısık ateşte köpürtülene dek pişir.", "Fincana döküp servis yap."], u2),
  ]);

  // 10 Favori
  await Favorite.create([
    { userId: users[0]._id, recipeId: recipes[0]._id },
    { userId: users[0]._id, recipeId: recipes[5]._id },
    { userId: users[1]._id, recipeId: recipes[10]._id },
    { userId: users[1]._id, recipeId: recipes[11]._id },
    { userId: users[2]._id, recipeId: recipes[20]._id },
    { userId: users[2]._id, recipeId: recipes[24]._id },
    { userId: users[3]._id, recipeId: recipes[14]._id },
    { userId: users[3]._id, recipeId: recipes[2]._id },
    { userId: users[4]._id, recipeId: recipes[28]._id },
    { userId: users[4]._id, recipeId: recipes[29]._id },
  ]);

  // 5 MealPlan
  const today = new Date();
  const day = (n: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);

  await MealPlan.create([
    {
      userId: users[0]._id, date: day(0),
      meals: [
        { mealType: "Kahvaltı", recipeId: recipes[0]._id },
        { mealType: "Öğle",    recipeId: recipes[5]._id },
        { mealType: "Akşam",   recipeId: recipes[10]._id },
      ],
      notes: "Pazartesi planı",
    },
    {
      userId: users[0]._id, date: day(1),
      meals: [
        { mealType: "Kahvaltı", recipeId: recipes[1]._id },
        { mealType: "Öğle",    recipeId: recipes[6]._id },
        { mealType: "Akşam",   recipeId: recipes[11]._id },
      ],
      notes: "Salı planı",
    },
    {
      userId: users[1]._id, date: day(0),
      meals: [
        { mealType: "Kahvaltı", recipeId: recipes[3]._id },
        { mealType: "Akşam",   recipeId: recipes[14]._id },
      ],
      notes: "",
    },
    {
      userId: users[2]._id, date: day(2),
      meals: [
        { mealType: "Öğle",    recipeId: recipes[8]._id },
        { mealType: "Akşam",   recipeId: recipes[18]._id },
        { mealType: "Ara Öğün", recipeId: recipes[28]._id },
      ],
      notes: "Vegan gün",
    },
    {
      userId: users[3]._id, date: day(1),
      meals: [
        { mealType: "Kahvaltı", recipeId: recipes[2]._id },
        { mealType: "Öğle",    recipeId: recipes[16]._id },
      ],
      notes: "Glutensiz tercih",
    },
  ]);

  console.log("✅ 30 recipe, 5 user, 10 favorite, 5 mealplan eklendi");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed hatası:", err);
  process.exit(1);
});
