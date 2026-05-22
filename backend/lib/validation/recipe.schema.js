const { z } = require("zod");

/**
 * Zod doğrulama şemaları — OpenAPI RecipeCreateRequest ile birebir uyumlu.
 */

// Malzeme alt şeması
const ingredientSchema = z.object({
  name: z.string().min(1, "Malzeme adı zorunludur").trim(),
  amount: z.string().min(1, "Malzeme miktarı zorunludur"),
  unit: z.string().optional().default(""),
  optional: z.boolean().optional().default(false),
});

// Kategori enum
const categoryEnum = z.enum([
  "Kahvaltı",
  "Çorba",
  "Ana Yemek",
  "Salata",
  "Tatlı",
  "İçecek",
  "Atıştırmalık",
]);

// Zorluk enum
const difficultyEnum = z.enum(["Kolay", "Orta", "Zor"]);

/**
 * POST /recipes — Tarif oluşturma şeması
 */
const createRecipeSchema = z.object({
  title: z
    .string()
    .min(1, "Tarif adı zorunludur")
    .max(100, "Tarif adı en fazla 100 karakter olabilir")
    .trim(),
  description: z
    .string()
    .min(1, "Tarif açıklaması zorunludur")
    .max(500, "Açıklama en fazla 500 karakter olabilir"),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "En az bir malzeme girilmelidir"),
  instructions: z
    .array(z.string().min(1))
    .min(1, "En az bir hazırlanış adımı girilmelidir"),
  cookTime: z
    .number()
    .int()
    .min(1, "Pişirme süresi en az 1 dakika olmalıdır"),
  prepTime: z.number().int().min(0).optional().default(0),
  servings: z
    .number()
    .int()
    .min(1, "Porsiyon sayısı en az 1 olmalıdır")
    .optional()
    .default(4),
  category: categoryEnum,
  difficulty: difficultyEnum.optional().default("Orta"),
  tags: z.array(z.string()).optional().default([]),
  imageUrl: z.string().optional().default(""),
});

/**
 * PUT /recipes/:id — Tarif güncelleme şeması (tüm alanlar opsiyonel)
 */
const updateRecipeSchema = createRecipeSchema.partial();

/**
 * Zod doğrulama middleware factory
 * Kullanım:  router.post("/", validate(createRecipeSchema), controller)
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    // zod v4: hatalar `issues` altında (`errors` kaldırıldı)
    const messages = result.error.issues.map((e) => e.message).join(", ");
    res.status(400);
    throw new Error(messages);
  }
  // Parse edilmiş (default'ları eklenmiş) veriyi body'ye yaz
  req.body = result.data;
  next();
};

module.exports = {
  createRecipeSchema,
  updateRecipeSchema,
  validate,
};
