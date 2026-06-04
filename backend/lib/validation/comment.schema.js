const { z } = require("zod");

/**
 * Comment Zod doğrulama şemaları.
 *
 * Görsel A.2'deki gereksinimlere göre:
 *  - rating: 1-5 arası tam sayı, zorunlu
 *  - text: max 500 karakter, opsiyonel, XSS pattern reddedilir
 */

// XSS pattern'i: <script>, javascript:, onerror= gibi tehlikeli içerikleri reddet
const XSS_PATTERN = /<script|javascript:|onerror=|onload=|<iframe/i;

const createCommentSchema = z.object({
  rating: z
    .number()
    .int("Puan tam sayı olmalıdır")
    .min(1, "Puan en az 1 olmalıdır")
    .max(5, "Puan en fazla 5 olmalıdır"),
  text: z
    .string()
    .max(500, "Yorum en fazla 500 karakter olabilir")
    .trim()
    .refine((t) => !XSS_PATTERN.test(t), {
      message: "Yorum güvenlik nedeniyle reddedildi",
    })
    .optional()
    .default(""),
});

/**
 * Zod doğrulama middleware factory.
 * recipe.schema.js'deki `validate` ile aynı pattern.
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const messages = result.error.issues.map((e) => e.message).join(", ");
    res.status(400);
    throw new Error(messages);
  }
  req.body = result.data;
  next();
};

module.exports = {
  createCommentSchema,
  validate,
};
