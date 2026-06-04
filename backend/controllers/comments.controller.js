const Comment = require("../models/Comment");
const { z } = require("zod");

// Zod Doğrulama Şeması (Gelen veriyi kontrol etmek için)
const commentSchema = z.object({
  rating: z.number().min(1, "Puan en az 1 olmalıdır.").max(5, "Puan en fazla 5 olmalıdır."),
  text: z.string().max(500, "Yorum 500 karakterden uzun olamaz.").optional().default(""),
});

// GET: Bir tarifin tüm yorumlarını getirir
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ recipeId: req.params.id })
      .populate("userId", "name") // Yorumu yapanın sadece adını getiriyoruz
      .sort({ createdAt: -1 }); // En yeni yorumlar en üstte görünsün
      
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Yorumlar getirilirken bir hata oluştu.", error: error.message });
  }
};

// POST: Bir tarife yeni yorum ekler
exports.createComment = async (req, res) => {
  try {
    // 1. Gelen veriyi Zod ile doğrula
    const { rating, text } = commentSchema.parse(req.body);

    // 2. Yeni yorumu oluştur
    const newComment = new Comment({
      recipeId: req.params.id,
      userId: req.user.id, // Auth middleware'den gelen giriş yapmış kullanıcının ID'si (Eğer sizde req.user._id kullanılıyorsa burayı _id olarak değiştir)
      rating,
      text
    });

    // 3. Veritabanına kaydet
    await newComment.save();
    
    // 4. Frontend'e hemen ismini de göstermek için populate et
    await newComment.populate("userId", "name");
    
    res.status(201).json(newComment);
  } catch (error) {
    // Zod doğrulama hatası yakalama
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Doğrulama hatası", errors: error.errors });
    }
    // MongoDB 11000 Hatası: Compound Index'e takıldı (Aynı kullanıcı 2. kez yorum yapmaya çalışıyor)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Bu tarife zaten yorum yaptınız." });
    }
    res.status(500).json({ message: "Yorum eklenirken hata oluştu.", error: error.message });
  }
};

// DELETE: Kullanıcının kendi yorumunu silmesi
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Yorum bulunamadı." });
    }

    // Yorumun sahibi, silmeye çalışan kişi ile aynı mı kontrolü
    if (comment.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Bu yorumu silme yetkiniz yok." });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Yorum başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: "Yorum silinirken hata oluştu.", error: error.message });
  }
};