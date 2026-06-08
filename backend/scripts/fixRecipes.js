/**
 * fixRecipes.js
 *
 * Mevcut tariflere targeted düzeltmeler uygular. seedRecipes.js'in aksine bu
 * script tarifleri SİLMEZ — başlığa göre bulup belirli alanları güncelliyor.
 * Idempotent: yeniden koşmak değer değiştirmez (aynı içeriği yeniden yazar).
 *
 * scripts/auditRecipes.js çıktısında "FIRIN: derece belirtilmemiş" veya
 * "FIRIN: süre belirtilmemiş" hatası olan tarifler ele alındı. Kaynak:
 * yemek.com (https://yemek.com).
 *
 * Run:
 *   node scripts/fixRecipes.js              # gerçek update
 *   node scripts/fixRecipes.js --dry-run    # ne değişeceğini göster, yazma
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");

const DRY_RUN = process.argv.includes("--dry-run");

/**
 * Her fix: { title, updates } veya { title, replaceInstructions: [...] }
 * - `updates`: $set ile geçen kısmi field güncellemeleri
 * - `replaceInstructions`: tüm instructions array'ini değiştirir
 *   (cookTime/prepTime gibi field'lar updates üzerinden de gönderilebilir)
 */
const FIXES = [
  // ── #50 Hünkar Beğendi — patlıcan fırınlama 200°C, 20 dk
  // Kaynak: https://yemek.com (Hünkar Beğendi tarifi)
  {
    title: "Hünkar Beğendi",
    replaceInstructions: [
      "Eti soğanla kavurun, salça ve su ekleyip 1 saat pişirin.",
      "Patlıcanları çatalla deldikten sonra 200°C önceden ısıtılmış fırında 20 dakika közleyin (veya doğrudan ocak alevinde).",
      "Patlıcanları soğutup kabuğunu soyun ve ezerek püre yapın.",
      "Tereyağında unu kavurun, patlıcanı ekleyip karıştırın.",
      "Sıcak sütü yavaşça ekleyin, koyulaşınca peynir ve baharatı katın.",
      "Beğendi sosunu tabağa yayıp üstüne yahniyi koyun ve sıcak servis edin.",
    ],
  },

  // ── #66 Patlıcan Salatası — patlıcan közleme 200°C 40 dk
  // Kaynak: https://yemek.com/tarif/patlican-salatasi/
  {
    title: "Patlıcan Salatası",
    replaceInstructions: [
      "Patlıcanları çatalla delip 200°C önceden ısıtılmış fırında 35-40 dakika közleyin (veya ocak ızgarasında doğrudan alevde).",
      "Patlıcanları soğutup kabuğunu soyun ve püre haline getirin.",
      "Yoğurt, ezilmiş sarımsak, limon suyu ve tuzu ekleyin.",
      "Üstüne zeytinyağı gezdirip maydanoz serpin, soğuk servis edin.",
    ],
  },

  // ── #73 Sütlaç — fırın 200°C 12-15 dk
  // Kaynak: https://yemek.com/tarif/firin-sutlac/
  {
    title: "Sütlaç",
    replaceInstructions: [
      "Pirinci suda yumuşayana kadar 20 dakika haşlayın.",
      "Sütü ekleyip kaynamaya bırakın, ara sıra karıştırın.",
      "Şekeri katıp eritin, 10 dakika daha pişirin.",
      "Az suyla açılmış nişastayı yavaşça karıştırarak ekleyin, kıvam alana kadar pişirin.",
      "Vanilyayı ekleyip kâselere paylaştırın.",
      "Önceden ısıtılmış 200°C fırında üzeri pembeleşene kadar 12-15 dakika fırınlayın.",
      "Soğuduktan sonra üzerine tarçın serpip servis edin.",
    ],
    updates: { cookTime: 45 }, // 20 dk haşlama + 10 dk şeker + kıvam + 15 dk fırın
  },

  // ── Aşure — büyük rewrite, geleneksel malzemeleri ekledik
  // Mevcut: 10 malzeme — pirinç, portakal/limon kabuğu, karanfil, elma,
  // badem, fındık, antep fıstığı, nar yoktu. Yemek.com'un 15 kişilik tarifini
  // 8 kişilik ev versiyonuna oranlayıp ekledim.
  // Kaynak: https://yemek.com/tarif/asure/
  {
    title: "Aşure",
    replaceInstructions: [
      "Aşurelik buğdayı yıkayıp 8-12 saat soğuk suda bekletin.",
      "Bekleyen buğdayı suyunu süzüp 2 litre sıcak suda 1-1.5 saat kısık ateşte yumuşayana kadar pişirin.",
      "Pirinç, portakal kabuğu, limon kabuğu ve 1 litre sıcak su ekleyip 20 dakika daha pişirin.",
      "Karanfilleri ayrı bir kâsede 1 su bardağı suyla kaynatıp süzün (karanfil suyu).",
      "Haşlanmış nohut ve fasulyeyi tencereye ekleyin.",
      "Dilimlenmiş elma, kuru üzüm, kuş üzümü, doğranmış kuru incir ve kayısıyı ekleyip 20 dakika pişirin.",
      "Şekeri ve süzülmüş karanfil suyunu katın, 15 dakika daha kaynatın.",
      "Ocaktan alıp 1-2 saat oda sıcaklığında ılınmaya bırakın (kıvam alır).",
      "Kâselere paylaştırın. Üzerine ceviz, badem, antep fıstığı serpip tarçınla süsleyin.",
      "İsteğe bağlı nar tanesi ve susam serperek servis edin.",
    ],
    updates: {
      prepTime: 720, // 12 saat bekleme
      cookTime: 165, // 1.5 sa buğday + 20 dk + 20 dk + 15 dk
      ingredients: [
        // Ana taneli/baklagil
        { name: "aşurelik buğday", amount: "1", unit: "su bardağı" },
        { name: "pirinç", amount: "3", unit: "yemek kaşığı" },
        { name: "haşlanmış nohut", amount: "0.5", unit: "su bardağı" },
        { name: "haşlanmış kuru fasulye", amount: "0.5", unit: "su bardağı" },
        // Aroma
        { name: "portakal kabuğu rendesi", amount: "1", unit: "yemek kaşığı" },
        { name: "limon kabuğu rendesi", amount: "1", unit: "yemek kaşığı" },
        { name: "karanfil", amount: "5", unit: "adet" },
        // Meyve
        { name: "elma", amount: "1", unit: "adet" },
        { name: "kuru üzüm", amount: "2", unit: "yemek kaşığı" },
        { name: "kuş üzümü", amount: "2", unit: "yemek kaşığı" },
        { name: "kuru incir", amount: "5", unit: "adet" },
        { name: "kuru kayısı", amount: "5", unit: "adet" },
        // Tatlandırıcı + sıvı
        { name: "toz şeker", amount: "1.5", unit: "su bardağı" },
        { name: "sıcak su", amount: "3", unit: "litre" },
        // Üzeri (kuruyemiş + süs)
        { name: "ceviz içi", amount: "3", unit: "yemek kaşığı" },
        { name: "badem", amount: "2", unit: "yemek kaşığı" },
        { name: "antep fıstığı", amount: "2", unit: "yemek kaşığı" },
        { name: "tarçın", amount: "1", unit: "yemek kaşığı" },
        { name: "nar tanesi", amount: "0.5", unit: "su bardağı", optional: true },
        { name: "susam", amount: "1", unit: "tatlı kaşığı", optional: true },
      ],
    },
  },

  // ── Kazandibi — tereyağı eklendi, karamelize ve soğutma adımları detaylandırıldı
  // Mevcut tarifte tereyağı eksikti ve karamelize tekniği çok özet ("ocakta yakın")
  // belirsizdi. Yemek.com tarif yöntemiyle daha açık anlatım.
  // Kaynak: https://yemek.com/tarif/kazandibi/
  {
    title: "Kazandibi",
    replaceInstructions: [
      "Tepsiye pudra şekerini yayıp orta ateşte sürekli karıştırarak tüm şeker eriyip altın karamel rengini alana kadar 4-5 dakika yakın.",
      "Derin bir tencerede süt, şeker, nişasta ve pirinç ununu telçırpıcıyla iyice çırpıp ocağa alın.",
      "Sürekli karıştırarak orta ateşte kıvam alıp kaynayana kadar 15 dakika pişirin (göz göz olmaya başlayınca koyulaştığını anlayın).",
      "Vanilya ve tereyağını ekleyip karıştırın, ocaktan alın.",
      "Karamelize tepsinin üzerine kepçeyle ince bir muhallebi katı yayın, tepsiyi 1 tur daha ateşte gezdirin (kazandibi izi için).",
      "Kalan muhallebiyi karamelize tabakanın üzerine dökün, oda sıcaklığında 1 saat soğutun.",
      "Buzdolabında en az 4 saat dinlendirin.",
      "Soğuduktan sonra ters çevirip kalıbından çıkarın, dilimleyip spatulayla rulo şeklinde sarın ve servis edin.",
    ],
    updates: {
      prepTime: 10,
      cookTime: 35, // 5 dk karamelize + 15 dk muhallebi + 1 sa soğutma + buzdolabı
      ingredients: [
        { name: "süt", amount: "1.2", unit: "litre" },
        { name: "toz şeker", amount: "1", unit: "su bardağı" },
        { name: "nişasta", amount: "5", unit: "yemek kaşığı" },
        { name: "pirinç unu", amount: "2", unit: "yemek kaşığı" },
        { name: "tereyağı", amount: "1", unit: "yemek kaşığı" },
        { name: "vanilya", amount: "1", unit: "paket" },
        { name: "pudra şekeri (karamelize için)", amount: "4", unit: "yemek kaşığı" },
      ],
    },
  },

  // ── Künefe — peynir türü netleştirildi, pişirme tekniği detaylandırıldı
  // Mevcut "tuzsuz peynir" çok genelti ve "iki yüzünü kızartın" tekniği belirsizdi.
  // Geleneksel olarak Antakya peyniri / dil peyniri kullanılır.
  // Kaynak: https://yemek.com/tarif/kunefe/
  {
    title: "Künefe",
    replaceInstructions: [
      "Şerbet için şeker ve suyu kısık ateşte kaynatın, limon suyunu ekleyip 20 dakika daha pişirin (kaşıktan ip gibi süzülmeli). Soğumaya bırakın.",
      "Tel kadayıfı bıçakla küçük doğrayın, eritilmiş tereyağıyla iyice ovuşturarak harmanlayın.",
      "Sahanın yarısına kadayıfın yarısını yayıp avuç içiyle bastırın.",
      "Üstüne ince dilimlenmiş peyniri eşit yayın, kalan kadayıfla kapatıp tekrar bastırın.",
      "Kısık ateşte alt taraf altın renge gelene kadar 5-7 dakika pişirin.",
      "Geniş bir tabak yardımıyla sahanı ters çevirin, künefeyi sahana geri kaydırıp diğer tarafını 5-7 dakika daha kızartın.",
      "Çıkar çıkmaz soğuk şerbeti üzerine dökün, dövülmüş antep fıstığı serpip sıcak servis edin.",
    ],
    updates: {
      ingredients: [
        { name: "tel kadayıf", amount: "300", unit: "gram" },
        { name: "tuzsuz Antakya peyniri (veya dil peyniri)", amount: "250", unit: "gram" },
        { name: "tereyağı", amount: "150", unit: "gram" },
        { name: "toz şeker", amount: "2", unit: "su bardağı" },
        { name: "su", amount: "2", unit: "su bardağı" },
        { name: "limon suyu", amount: "1", unit: "yemek kaşığı" },
        { name: "antep fıstığı (dövülmüş)", amount: "3", unit: "yemek kaşığı" },
      ],
    },
  },

  // ── Tarhana Çorbası — sarımsak eksikti, yumuşatma tekniği yanlıştı
  // Mevcut: "1 saat suda bekletin" → klasik tekniği oda sıcaklığında suyla
  // çırpılarak yumuşatma. Sarımsak klasik tarhana çorbasının olmazsa olmazı.
  // Nane çorbanın içinde, üst süs değil.
  // Kaynak: https://yemek.com/tarif/tarhana-corbasi/
  {
    title: "Tarhana Çorbası",
    replaceInstructions: [
      "Tarhana, nane ve 2 su bardağı oda sıcaklığında suyu derin bir kâsede telçırpıcıyla çırparak yumuşatın, 15 dakika dinlendirin.",
      "Tencerede tereyağı ve sıvı yağı eritin, ezilmiş sarımsağı 30 saniye kavurun.",
      "Salçayı ekleyip 1 dakika daha kavurun (yakmayın).",
      "Yumuşamış tarhana karışımını ekleyip karıştırın, kalan 5 su bardağı sıcak suyu yavaşça katın.",
      "Sürekli karıştırarak kaynayana kadar pişirin, tuzu ekleyip 15 dakika daha pişirin.",
      "Servis sırasında üzerine pul biberli kızdırılmış tereyağı gezdirin.",
    ],
    updates: {
      prepTime: 15,
      cookTime: 20,
      ingredients: [
        { name: "tarhana", amount: "4", unit: "yemek kaşığı" },
        { name: "kuru nane", amount: "1", unit: "yemek kaşığı" },
        { name: "sarımsak", amount: "1", unit: "diş" },
        { name: "domates salçası", amount: "1", unit: "yemek kaşığı" },
        { name: "tereyağı", amount: "1", unit: "yemek kaşığı" },
        { name: "sıvı yağ", amount: "1", unit: "yemek kaşığı" },
        { name: "su", amount: "7", unit: "su bardağı" },
        { name: "tuz", amount: "1", unit: "tatlı kaşığı" },
        { name: "pul biber (üzeri için)", amount: "1", unit: "tatlı kaşığı" },
      ],
    },
  },

  // ── Ezogelin Çorbası — kimyon opsiyonel + servis limonu, kavurma tekniği detaylı
  // Mevcut tarif: salça ve nane çorbaya birlikte atılıyor. Yemek.com daha
  // doğru: soğan + salça + nane ayrı tavada kavrulup çorbaya katılır.
  // Klasik servis için yarım limon eksikti.
  // Kaynak: https://yemek.com/tarif/ezogelin-corbasi/
  {
    title: "Ezogelin Çorbası",
    replaceInstructions: [
      "Sıcak suyu tencerede kaynatın, yıkanmış mercimek, pirinç, bulgur ve tuzu ekleyin.",
      "Kısık ateşte mercimekler dağılana kadar 30 dakika pişirin.",
      "Ayrı bir tavada tereyağını eritin, küp doğranmış soğanı pembeleştirin.",
      "Salçayı ekleyip 1 dakika kavurun, sonra kuru naneyi katıp 30 saniye daha kavurun.",
      "Kavurmayı çorbaya ekleyip 5 dakika daha pişirin.",
      "Pul biber ve isteğe bağlı kimyon serpip karıştırın.",
      "Servis tabaklarına alıp üzerine taze limon suyu sıkın.",
    ],
    updates: {
      prepTime: 10,
      cookTime: 40,
      ingredients: [
        { name: "kırmızı mercimek", amount: "0.5", unit: "su bardağı" },
        { name: "bulgur", amount: "2", unit: "yemek kaşığı" },
        { name: "pirinç", amount: "2", unit: "yemek kaşığı" },
        { name: "soğan", amount: "1", unit: "adet" },
        { name: "domates salçası", amount: "1", unit: "yemek kaşığı" },
        { name: "tereyağı", amount: "2", unit: "yemek kaşığı" },
        { name: "kuru nane", amount: "1", unit: "tatlı kaşığı" },
        { name: "pul biber", amount: "1", unit: "tatlı kaşığı" },
        { name: "kimyon", amount: "0.5", unit: "tatlı kaşığı", optional: true },
        { name: "limon (servis için)", amount: "0.5", unit: "adet" },
        { name: "tuz", amount: "1", unit: "tatlı kaşığı" },
        { name: "sıcak su", amount: "7", unit: "su bardağı" },
      ],
    },
  },

  // ── Mantar Çorbası — limon (mantar kararma engeller) + dereotu üst süsü
  // Mevcut tarif iyi ama yemek.com'a göre 2 küçük ekleme: mantarlar haşlama
  // suyunda limon (kararmasın), servis sırasında dereotu.
  // Kaynak: https://yemek.com/tarif/mantar-corbasi/
  {
    title: "Mantar Çorbası",
    replaceInstructions: [
      "Mantarları temizleyip dilimleyin, soğanı ince doğrayın.",
      "Tereyağında soğanı pembeleştirin, mantarları ve birkaç damla limon suyunu ekleyin (kararmasın).",
      "Mantarlar suyunu çekene kadar 5 dakika kavurun, unu ilave edip 1 dakika daha kavurun.",
      "Suyu ve sütü yavaşça karıştırarak ekleyin, sürekli karıştırın.",
      "Tuz ve karabiberle tatlandırıp kısık ateşte 10 dakika kaynatın.",
      "Servis sırasında üzerine kıyılmış taze dereotu serpin.",
    ],
    updates: {
      ingredients: [
        { name: "mantar", amount: "300", unit: "gram" },
        { name: "soğan", amount: "1", unit: "adet" },
        { name: "un", amount: "2", unit: "yemek kaşığı" },
        { name: "süt", amount: "2", unit: "su bardağı" },
        { name: "tereyağı", amount: "3", unit: "yemek kaşığı" },
        { name: "limon suyu", amount: "1", unit: "tatlı kaşığı" },
        { name: "tuz", amount: "1", unit: "tatlı kaşığı" },
        { name: "karabiber", amount: "1", unit: "tutam" },
        { name: "su", amount: "3", unit: "su bardağı" },
        { name: "taze dereotu (üzeri için)", amount: "1", unit: "yemek kaşığı" },
      ],
    },
  },

  // ── Düğün Çorbası — toz kırmızı biber + nane üst süsü (klasik tat)
  // Mevcut tarif "üstüne pul biberli tereyağı" diyor — eksik: nane ve toz
  // kırmızı biber. Düğün çorbasında bu üçü beraber yakılır.
  // Kaynak: https://yemek.com/tarif/dugun-corbasi/
  {
    title: "Düğün Çorbası",
    replaceInstructions: [
      "Kuzu kuşbaşını yıkayıp tencereye alın, suyu ekleyip kaynatın, köpüğünü temizleyin.",
      "Kısık ateşte 1 saat haşlayın, eti süzüp suyunu saklayın.",
      "Yoğurt, un, yumurta sarısı ve limon suyunu derin kâsede telçırpıcıyla iyice çırpın.",
      "Yoğurt karışımına azar azar 2 su bardağı sıcak et suyu ekleyerek tavlandırın (yoğurt kesilmesin).",
      "Tavlandırılmış karışımı kalan et suyuna sürekli karıştırarak dökün, eti tencereye geri koyun.",
      "Tuzu ekleyip sürekli karıştırarak 10 dakika kısık ateşte kaynatın.",
      "Ayrı bir tavada tereyağını eritin, toz kırmızı biber, kuru nane ve pul biberi katıp 30 saniye yakın.",
      "Servis sırasında bu yağı çorbanın üzerine gezdirin.",
    ],
    updates: {
      ingredients: [
        { name: "kuzu kuşbaşı", amount: "200", unit: "gram" },
        { name: "yoğurt", amount: "1", unit: "su bardağı" },
        { name: "yumurta sarısı", amount: "1", unit: "adet" },
        { name: "un", amount: "1", unit: "yemek kaşığı" },
        { name: "limon", amount: "0.5", unit: "adet" },
        { name: "tuz", amount: "1", unit: "tatlı kaşığı" },
        { name: "su", amount: "6", unit: "su bardağı" },
        // Üzeri için
        { name: "tereyağı (üzeri için)", amount: "2", unit: "yemek kaşığı" },
        { name: "toz kırmızı biber", amount: "0.5", unit: "çay kaşığı" },
        { name: "kuru nane", amount: "1", unit: "tutam" },
        { name: "pul biber", amount: "1", unit: "tatlı kaşığı" },
      ],
    },
  },

  // ── #2 İskender — yemek.com'a göre içerik zenginleştirildi
  // Mevcut tarif sadece 5 malzemeydi (et, pide, yoğurt, domates sosu, tereyağı)
  // — domates sosu ve et marinasyonu için detay eksikti.
  // Kaynak: https://yemek.com/tarif/iskender/
  {
    title: "İskender",
    replaceInstructions: [
      "Antrikotu ince dilimleyip süt, ezilmiş sarımsak, salça, kekik, kırmızı biber ve tuzla harmanlayıp 1 saat marine edin.",
      "Tırnak pideyi küp doğrayıp kuru tavada 1-2 dakika ısıtın, derin tabağa dizin.",
      "Tereyağını eritip eti 6-8 dakika yüksek ateşte mühürleyin ve pidelerin üstüne koyun.",
      "Domates sosu için: tereyağında salça ve kırmızı biberi kavurun, sıcak su ve tuz ekleyip 3 dakika kaynatın.",
      "Yoğurdu pidelerin yanına yerleştirin, domates sosunu etin üstüne gezdirin.",
      "Kalan tereyağını cızırdayana kadar ısıtıp tabağın üstüne dökerek sıcak servis edin.",
    ],
    updates: {
      prepTime: 65, // 60 dk marinasyon + 5 dk hazırlık
      cookTime: 15,
      servings: 2,
      ingredients: [
        // Et için
        { name: "antrikot (ince dilimlenmiş döner)", amount: "400", unit: "gram" },
        { name: "süt", amount: "0.5", unit: "su bardağı" },
        { name: "sarımsak", amount: "2", unit: "diş" },
        { name: "salça", amount: "1", unit: "tatlı kaşığı" },
        { name: "kekik", amount: "1", unit: "tatlı kaşığı" },
        { name: "kırmızı toz biber", amount: "1", unit: "tatlı kaşığı" },
        // Sos için
        { name: "domates salçası", amount: "1", unit: "yemek kaşığı" },
        { name: "kırmızı toz biber", amount: "1", unit: "tatlı kaşığı" },
        { name: "sıcak su", amount: "1", unit: "su bardağı" },
        // Servis için
        { name: "tırnak pide", amount: "2", unit: "adet" },
        { name: "süzme yoğurt", amount: "1", unit: "su bardağı" },
        { name: "tereyağı", amount: "80", unit: "gram" },
        { name: "tuz", amount: "1", unit: "tatlı kaşığı" },
        { name: "karabiber", amount: "1", unit: "çay kaşığı" },
      ],
    },
  },
];

(async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI tanımlı değil");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB bağlandı ${DRY_RUN ? "(DRY-RUN modu)" : ""}\n`);

  let updated = 0;
  let notFound = 0;

  for (const fix of FIXES) {
    const recipe = await Recipe.findOne({ title: fix.title });
    if (!recipe) {
      console.log(`⚠️  "${fix.title}" bulunamadı, atlandı`);
      notFound++;
      continue;
    }

    const patch = {};
    if (fix.replaceInstructions) patch.instructions = fix.replaceInstructions;
    if (fix.updates) Object.assign(patch, fix.updates);

    console.log(`📝 ${fix.title}`);
    Object.entries(patch).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        console.log(`    ${key}: ${value.length} adım`);
      } else {
        console.log(`    ${key}: ${value}`);
      }
    });

    if (!DRY_RUN) {
      await Recipe.updateOne({ _id: recipe._id }, { $set: patch });
    }
    updated++;
    console.log();
  }

  console.log(
    `Toplam: ${updated} tarif ${DRY_RUN ? "güncellenecek" : "güncellendi"}, ${notFound} bulunamadı`
  );

  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
