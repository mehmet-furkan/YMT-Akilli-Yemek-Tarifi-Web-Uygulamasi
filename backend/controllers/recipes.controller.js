const Recipe = require("../models/Recipe");
const asyncHandler = require("../lib/asyncHandler");

// ─────────────────────────────────────────────
// Akıllı Malzeme Sözlüğü (Ingredient Dictionary)
// Bir anahtar kelime arandığında ilişkili tüm malzemeleri de arar.
// ─────────────────────────────────────────────
const INGREDIENT_DICTIONARY = {
  // Et türleri
  et: ["et", "dana eti", "kuzu eti", "dana kuşbaşı", "kuşbaşı", "kıyma", "kavurma", "biftek", "antrikot", "bonfile", "pirzola", "sucuk", "pastırma", "sığır eti"],
  kıyma: ["kıyma", "dana kıyma", "kuzu kıyma", "karışık kıyma"],
  kuşbaşı: ["kuşbaşı", "dana kuşbaşı", "kuzu kuşbaşı"],

  // Tavuk & kanatlı
  tavuk: ["tavuk", "tavuk göğsü", "tavuk but", "tavuk kanat", "kanat", "tavuk baget", "tavuk eti", "piliç", "piliç göğsü", "tavuk köfte"],
  hindi: ["hindi", "hindi eti", "hindi göğsü", "hindi but"],

  // Balık & deniz ürünleri
  balık: ["balık", "levrek", "çipura", "somon", "hamsi", "palamut", "lüfer", "mezgit", "alabalık", "ton balığı", "sardalya"],
  "deniz ürünleri": ["deniz ürünleri", "karides", "midye", "kalamar", "ahtapot", "istakoz"],
  karides: ["karides", "jumbo karides", "deniz ürünleri"],

  // Süt ürünleri
  peynir: ["peynir", "beyaz peynir", "kaşar peyniri", "tulum peyniri", "lor peyniri", "çökelek", "labne", "hellim", "mozarella", "parmesan", "cheddar", "cream cheese"],
  süt: ["süt", "tam yağlı süt", "yarım yağlı süt", "yağsız süt"],
  yoğurt: ["yoğurt", "süzme yoğurt", "homojen yoğurt"],
  krema: ["krema", "süt kreması", "sıvı krema", "çikolatalı krema"],
  tereyağı: ["tereyağı", "margarin", "sadeyağ"],

  // Sebzeler
  domates: ["domates", "cherry domates", "domates salçası", "domates suyu", "konserve domates"],
  biber: ["biber", "sivri biber", "dolmalık biber", "çarliston biber", "kapya biber", "kırmızı biber", "yeşil biber", "acı biber", "pul biber"],
  patlıcan: ["patlıcan", "kemer patlıcan", "bostan patlıcan"],
  kabak: ["kabak", "sakız kabağı", "bal kabağı", "balkabağı"],
  patates: ["patates", "bebek patates", "tatlı patates"],
  soğan: ["soğan", "kuru soğan", "yeşil soğan", "arpacık soğan", "taze soğan"],
  sarımsak: ["sarımsak", "sarımsak dişi"],
  havuç: ["havuç", "bebek havuç"],
  ıspanak: ["ıspanak", "bebek ıspanak"],
  fasulye: ["fasulye", "taze fasulye", "kuru fasulye", "barbunya", "börülce"],
  bezelye: ["bezelye", "taze bezelye", "konserve bezelye"],
  mercimek: ["mercimek", "kırmızı mercimek", "yeşil mercimek"],
  nohut: ["nohut", "konserve nohut"],
  bulgur: ["bulgur", "ince bulgur", "pilavlık bulgur"],
  makarna: ["makarna", "spagetti", "penne", "erişte", "şehriye", "lazanya", "fettuccine"],

  // Baharatlar
  baharat: ["baharat", "karabiber", "kimyon", "kekik", "pul biber", "sumak", "tarçın", "zerdeçal", "köri", "zencefil", "defne yaprağı", "nane", "maydanoz", "dereotu"],

  // Tahıllar & unlar
  un: ["un", "buğday unu", "tam buğday unu", "mısır unu", "nişasta", "galeta unu"],
  pirinç: ["pirinç", "baldo pirinç", "basmati pirinç", "jasmine pirinç"],
  ekmek: ["ekmek", "bayat ekmek", "pide", "lavaş", "bazlama", "yufka"],

  // Yağlar
  yağ: ["yağ", "zeytinyağı", "sıvı yağ", "ayçiçek yağı", "mısırözü yağı", "tereyağı", "fındık yağı", "susam yağı"],
  zeytinyağı: ["zeytinyağı", "sızma zeytinyağı", "riviera zeytinyağı"],
};

/**
 * Verilen bir anahtar kelimeyi sözlükteki eş anlamlılarla genişletir.
 * Eğer sözlükte yoksa orijinal kelimeyi döndürür.
 * @param {string} keyword - Aranacak anahtar kelime
 * @returns {string[]} - Genişletilmiş malzeme listesi
 */
function expandIngredient(keyword) {
  const lower = keyword.toLowerCase().trim();

  // 1) Doğrudan sözlükte anahtar olarak var mı?
  if (INGREDIENT_DICTIONARY[lower]) {
    return INGREDIENT_DICTIONARY[lower];
  }

  // 2) Sözlükteki herhangi bir grubun değerlerinde var mı?
  //    (ör. "kuşbaşı" aranırsa "et" grubundan tüm eşleşmeleri getir)
  for (const [, synonyms] of Object.entries(INGREDIENT_DICTIONARY)) {
    if (synonyms.some((s) => s === lower)) {
      return synonyms;
    }
  }

  // 3) Sözlükte bulunamadı → orijinal kelimeyi döndür
  return [lower];
}

// ─────────────────────────────────────────────
// GET /api/recipes
// Tarifleri listele — arama, filtreleme, sayfalama
// ─────────────────────────────────────────────
const getRecipes = asyncHandler(async (req, res) => {
  const {
    search,
    ingredient,
    category,
    maxCookTime,
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {};

  // 1) Text search — MongoDB $text (Recipe.title text index)
  if (search) {
    filter.$text = { $search: search };
  }

  // 2) Malzeme filtresi — ?ingredient=domates&ingredient=biber
  //    Birden fazla ingredient → $all (tüm malzemeler olsun)
  //    Akıllı sözlük ile genişletilmiş arama
  if (ingredient) {
    const ingredients = Array.isArray(ingredient) ? ingredient : [ingredient];
    const boundary = "[^a-zA-Z0-9çğıöşüÇĞIÖŞÜ]";

    filter["ingredients.name"] = {
      $all: ingredients.map((i) => {
        // Sözlükten genişletilmiş terimler
        const expanded = expandIngredient(i);

        if (expanded.length === 1) {
          // Tek terim — orijinal regex davranışı
          return new RegExp(`(^|${boundary})${expanded[0]}(${boundary}|$)`, "i");
        }

        // Birden fazla eş anlamlı → (terim1|terim2|...) şeklinde OR regex
        const alternation = expanded
          .map((term) => `(^|${boundary})${term}(${boundary}|$)`)
          .join("|");
        return new RegExp(alternation, "i");
      }),
    };
  }

  // 3) Kategori filtresi
  if (category) {
    filter.category = category;
  }

  // 4) Maksimum pişirme süresi
  if (maxCookTime) {
    filter.cookTime = { $lte: Number(maxCookTime) };
  }

  // Sayfalama hesaplamaları
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Math.min(100, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  // Paralel sorgular: veri + toplam sayı
  const [data, total] = await Promise.all([
    Recipe.find(filter)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Recipe.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.json({
    success: true,
    data,
    meta: {
      total,
      page: pageNum,
      totalPages,
      limit: limitNum,
    },
  });
});

// ─────────────────────────────────────────────
// GET /api/recipes/:id
// Tek tarif detayı, populate createdBy (sadece name)
// ─────────────────────────────────────────────
const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate(
    "createdBy",
    "name"
  );

  if (!recipe) {
    res.status(404);
    throw new Error("Tarif bulunamadı");
  }

  res.json({ success: true, data: recipe });
});

// ─────────────────────────────────────────────
// POST /api/recipes
// Yeni tarif oluştur — auth required, zod validated
// ─────────────────────────────────────────────
const createRecipe = asyncHandler(async (req, res) => {
  // req.body zaten validate middleware tarafından temizlenmiş
  const recipe = await Recipe.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: recipe });
});

// ─────────────────────────────────────────────
// PUT /api/recipes/:id
// Tarif güncelle — auth + owner check
// ─────────────────────────────────────────────
const updateRecipe = asyncHandler(async (req, res) => {
  let recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error("Tarif bulunamadı");
  }

  // Sahiplik kontrolü
  if (recipe.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Bu tarifi güncelleme yetkiniz yok");
  }

  recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: recipe });
});

// ─────────────────────────────────────────────
// DELETE /api/recipes/:id
// Tarif sil — auth + owner check
// ─────────────────────────────────────────────
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error("Tarif bulunamadı");
  }

  // Sahiplik kontrolü
  if (recipe.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Bu tarifi silme yetkiniz yok");
  }

  await recipe.deleteOne();

  // OpenAPI spec: 204 No Content
  res.status(204).send();
});

// ─────────────────────────────────────────────
// GET /api/recipes/random
// Rastgele 1 tarif döner — $sample aggregation
// ─────────────────────────────────────────────
const getRandomRecipe = asyncHandler(async (req, res) => {
  const [recipe] = await Recipe.aggregate([
    { $sample: { size: 1 } },
  ]);

  if (!recipe) {
    res.status(404);
    throw new Error("Henüz hiç tarif yok");
  }

  res.json({ success: true, data: recipe });
});

// ─────────────────────────────────────────────
// POST /api/recipes/search-by-ingredients
// Malzemelere göre tarif ara — eşleşme skoruyla (Public)
// Akıllı sözlük ile genişletilmiş arama
// ─────────────────────────────────────────────
const searchByIngredients = asyncHandler(async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    res.status(400);
    throw new Error("En az bir malzeme girilmelidir");
  }

  // Her bir arama terimini sözlükle genişlet
  const searchIngs = ingredients.map((i) => String(i).toLowerCase().trim());
  const expandedSearchIngs = searchIngs.flatMap((i) => expandIngredient(i));
  // Tekrarları kaldır
  const uniqueExpandedIngs = [...new Set(expandedSearchIngs)];

  const allRecipes = await Recipe.find().populate("createdBy", "name");

  // Tam kelime eşleşmesi için yardımcı fonksiyon (Türkçe karakter destekli)
  const isExactMatch = (recipeIng, searchIng) => {
    const boundary = "[^a-zA-Z0-9çğıöşüÇĞIÖŞÜ]";
    const regexU = new RegExp(`(^|${boundary})${searchIng}(${boundary}|$)`, "i");
    const regexR = new RegExp(`(^|${boundary})${recipeIng}(${boundary}|$)`, "i");
    return regexU.test(recipeIng) || regexR.test(searchIng);
  };

  const scored = allRecipes
    .map((recipe) => {
      const recipeIngs = recipe.ingredients.map((i) => i.name.toLowerCase());

      // Genişletilmiş terimlerle eşleşme kontrolü
      const matchedCount = uniqueExpandedIngs.filter((si) =>
        recipeIngs.some((ri) => isExactMatch(ri, si))
      ).length;

      const required = recipe.ingredients.filter((i) => !i.optional);
      const missing = required.filter(
        (i) =>
          !uniqueExpandedIngs.some(
            (si) => isExactMatch(i.name.toLowerCase(), si)
          )
      );

      const matchPercentage =
        required.length > 0
          ? Math.round(
              ((required.length - missing.length) / required.length) * 100
            )
          : 0;

      return {
        recipe,
        matchedCount,
        missingIngredients: missing.map((i) => i.name),
        matchPercentage,
      };
    })
    .filter((r) => r.matchedCount > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  res.json({ success: true, count: scored.length, data: scored });
});

module.exports = {
  getRecipes,
  getRecipeById,
  getRandomRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchByIngredients,
};

