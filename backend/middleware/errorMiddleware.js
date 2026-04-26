// Bulunamayan route'lar için 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Bulunamadı - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Genel hata yakalama middleware'i
const errorHandler = (err, req, res, next) => {
  // Status code 200 ise 500'e çevir (beklenmeyen hatalar için)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose kötü ObjectId hatası (CastError)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Kaynak bulunamadı";
  }

  // Mongoose doğrulama hatası (ValidationError)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Mongoose tekrarlı anahtar hatası (Duplicate Key)
  if (err.code === 11000) {
    statusCode = 400;
    message = "Bu kayıt zaten mevcut";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
