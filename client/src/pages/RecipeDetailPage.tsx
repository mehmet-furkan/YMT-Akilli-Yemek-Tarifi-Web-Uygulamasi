import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import type { ApiResponse, Recipe, RecipeNutrition } from '../types/recipe';
import type { Comment } from '../types/comment';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useRecipeComments } from '../hooks/useRecipeComments';

async function fetchRecipe(id: string): Promise<Recipe> {
  const { data } = await api.get<ApiResponse<Recipe>>(`/recipes/${id}`);
  return data.data;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Kolay: 'bg-emerald-100 text-emerald-700',
  Orta: 'bg-amber-100 text-amber-700',
  Zor: 'bg-rose-100 text-rose-700',
};

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: recipe, isLoading, isError, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipe(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <RecipeDetailSkeleton />;
  }

  if (isError || !recipe) {
    return (
      <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 text-center">
        <span className="text-5xl mb-4 block" aria-hidden="true">😕</span>
        <h1 className="text-xl font-semibold text-stone-800 mb-2">Tarif bulunamadı</h1>
        <p className="text-stone-500 text-sm mb-6">
          {error instanceof Error ? error.message : 'Bu tarif mevcut değil ya da kaldırılmış.'}
        </p>
        <Link
          to="/"
          className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </main>
    );
  }

  const totalTime = (recipe.prepTime ?? 0) + recipe.cookTime;

  return (
    <main className="min-h-screen bg-stone-50 pb-16">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10z" clipRule="evenodd" />
          </svg>
          Tüm tarifler
        </Link>

        {/* Card with image + content */}
        <article className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
          {/* Image: confined to card width, aspect-[16/9], capped at 20rem tall */}
          <div className="relative w-full aspect-[16/9] max-h-80 bg-amber-100 overflow-hidden">
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200">
                <span className="text-7xl" aria-hidden="true">🍴</span>
              </div>
            )}

            {/* Favorite button — sağ üst köşe */}
            <FavoriteButton recipeId={recipe._id} />
          </div>

          <div className="p-5 sm:p-8">
            {/* Category + Difficulty + Rating */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Link
                to={`/?category=${encodeURIComponent(recipe.category)}`}
                className="text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 px-2.5 py-1 rounded-full transition-colors"
                aria-label={`${recipe.category} kategorisindeki tarifleri göster`}
              >
                {recipe.category}
              </Link>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  DIFFICULTY_COLOR[recipe.difficulty] ?? 'bg-stone-100 text-stone-600'
                }`}
              >
                {recipe.difficulty}
              </span>
              {(recipe.ratingsCount ?? 0) > 0 && (
                <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                  <span aria-hidden="true">★</span>
                  {(recipe.averageRating ?? 0).toFixed(1)}
                  <span className="text-stone-400 font-normal">
                    ({recipe.ratingsCount} oy)
                  </span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 leading-tight mb-2">
              {recipe.title}
            </h1>

            {/* Description */}
            {recipe.description && (
              <p className="text-stone-500 text-sm leading-relaxed mb-5">
                {recipe.description}
              </p>
            )}

            {/* Stats row */}
            <div className="flex flex-wrap gap-5 py-4 border-y border-stone-100 mb-4 text-sm">
              <Stat icon="⏱️" label="Toplam Süre" value={`${totalTime} dk`} />
              {(recipe.prepTime ?? 0) > 0 && (
                <Stat icon="🔪" label="Hazırlık" value={`${recipe.prepTime} dk`} />
              )}
              <Stat icon="🍳" label="Pişirme" value={`${recipe.cookTime} dk`} />
              <Stat icon="👥" label="Kişi" value={`${recipe.servings ?? 1}`} />
              {recipe.nutrition?.calories != null && (
                <Stat icon="🔥" label="Kcal/Porsiyon" value={`≈ ${recipe.nutrition.calories} kcal`} />
              )}
            </div>

            {/* Besin değerleri akordionu — sadece veri varsa göster */}
            {recipe.nutrition && (
              <NutritionAccordion nutrition={recipe.nutrition} />
            )}

            {/* Two-column layout on sm+ */}
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Ingredients */}
              <section>
                <h2 className="text-base font-semibold text-stone-800 mb-3">
                  🧺 Malzemeler
                </h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-stone-700"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" aria-hidden="true" />
                      <span>
                        {ing.amount && (
                          <span className="font-medium">
                            {ing.amount}
                            {ing.unit ? ` ${ing.unit}` : ''}{' '}
                          </span>
                        )}
                        {ing.name}
                        {ing.optional && (
                          <span className="text-stone-400 text-xs ml-1">(isteğe bağlı)</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Instructions */}
              <section>
                <h2 className="text-base font-semibold text-stone-800 mb-3">
                  📋 Hazırlanışı
                </h2>
                <ol className="space-y-4">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-stone-700">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Rating + Comments */}
            <CommentsSection recipeId={recipe._id} />
          </div>
        </article>
      </div>
    </main>
  );
}

// ─── Favorite Button (image üstüne absolute) ───────────────────────────────────

function FavoriteButton({ recipeId }: { recipeId: string }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isFavorited, toggleFavorite, isMutating } = useFavorites();

  const favorited = isAuthenticated && isFavorited(recipeId);

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await toggleFavorite(recipeId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isMutating}
      aria-label={favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      aria-pressed={favorited}
      className={`
        absolute top-3 right-3
        w-11 h-11 rounded-full
        flex items-center justify-center
        backdrop-blur-sm shadow-md
        transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        ${favorited
          ? 'bg-rose-500 text-white scale-105'
          : 'bg-white/95 text-stone-500 hover:text-rose-500 hover:bg-white hover:scale-105'
        }
      `}
    >
      {favorited ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
          <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-2.184C4.045 12.223 2 9.914 2 7a5 5 0 018-4 5 5 0 018 4c0 2.914-2.045 5.223-3.885 7.036a22.045 22.045 0 01-2.582 2.184 20.759 20.759 0 01-1.162.682l-.019.01-.005.003h-.002a.739.739 0 01-.69 0h-.002z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      )}
    </button>
  );
}

// ─── Comments Section ──────────────────────────────────────────────────────────

function CommentsSection({ recipeId }: { recipeId: string }) {
  const { isAuthenticated, user } = useAuth();
  const {
    comments,
    isLoading,
    createComment,
    isCreating,
    createError,
    deleteComment,
    isDeleting,
  } = useRecipeComments(recipeId);

  // Kullanıcı zaten yorum yapmış mı?
  const ownComment = user
    ? comments.find((c) => {
        const authorId = typeof c.userId === 'string' ? c.userId : c.userId._id;
        return authorId === user._id;
      })
    : undefined;

  return (
    <section className="mt-10 pt-8 border-t border-stone-100">
      <h2 className="text-lg font-semibold text-stone-800 mb-5">
        💬 Yorumlar ve Puanlamalar
      </h2>

      {/* Form: giriş yapmış ve kendi yorumu yoksa */}
      {isAuthenticated && !ownComment && (
        <CommentForm
          onSubmit={async (payload) => {
            await createComment(payload);
          }}
          isSubmitting={isCreating}
          error={createError}
        />
      )}

      {/* Kullanıcının kendi yorumu varsa bilgilendirici mesaj */}
      {isAuthenticated && ownComment && (
        <div className="mb-6 text-xs text-stone-400 italic">
          Bu tarife daha önce yorum yaptınız. Aşağıdan silip yeniden ekleyebilirsiniz.
        </div>
      )}

      {/* Giriş yapmamış ziyaretçi */}
      {!isAuthenticated && (
        <div className="mb-6 bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-stone-600">
          Puan vermek ve yorum yazmak için{' '}
          <Link to="/login" className="text-amber-700 font-medium hover:underline">
            giriş yapın
          </Link>
          .
        </div>
      )}

      {/* Liste */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-stone-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-stone-400 text-center py-6">
          Henüz yorum yapılmamış. İlk yorumu sen yaz.
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => {
            const isOwn =
              user &&
              (typeof c.userId === 'string'
                ? c.userId === user._id
                : c.userId._id === user._id);
            return (
              <CommentItem
                key={c._id}
                comment={c}
                isOwn={Boolean(isOwn)}
                onDelete={isOwn ? () => deleteComment(c._id) : undefined}
                isDeleting={isDeleting}
              />
            );
          })}
        </ul>
      )}
    </section>
  );
}

// ─── Comment Form ──────────────────────────────────────────────────────────────

interface CommentFormProps {
  onSubmit: (payload: { rating: number; text?: string }) => Promise<void>;
  isSubmitting: boolean;
  error: Error | null;
}

function CommentForm({ onSubmit, isSubmitting, error }: CommentFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (rating < 1 || rating > 5) {
      setLocalError('Lütfen 1-5 arası bir puan seçin');
      return;
    }
    try {
      await onSubmit({ rating, text: text.trim() || undefined });
      setRating(0);
      setText('');
    } catch {
      // hata zaten createError üzerinden gösterilecek
    }
  };

  const displayRating = hoverRating || rating;
  const apiErrorMessage =
    (error as { response?: { data?: { message?: string } } } | null)?.response
      ?.data?.message ?? error?.message;

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-5"
    >
      <label className="block text-sm font-medium text-stone-700 mb-2">
        Puanın
      </label>
      <div
        className="flex gap-1 mb-4"
        role="radiogroup"
        aria-label="Puanlama"
        onMouseLeave={() => setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={rating === star}
            aria-label={`${star} yıldız`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            className="text-3xl leading-none transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded"
          >
            <span
              className={
                star <= displayRating ? 'text-amber-400' : 'text-stone-300'
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>

      <label
        htmlFor="comment-text"
        className="block text-sm font-medium text-stone-700 mb-2"
      >
        Yorumun <span className="text-stone-400 font-normal">(opsiyonel)</span>
      </label>
      <textarea
        id="comment-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={500}
        rows={3}
        placeholder="Bu tarif hakkında düşünceleriniz..."
        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent resize-none"
      />
      <div className="text-xs text-stone-400 mt-1 text-right">
        {text.length}/500
      </div>

      {(localError || apiErrorMessage) && (
        <p className="text-sm text-rose-600 mb-3">
          {localError ?? apiErrorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="mt-2 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
      >
        {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
      </button>
    </form>
  );
}

// ─── Comment Item ──────────────────────────────────────────────────────────────

interface CommentItemProps {
  comment: Comment;
  isOwn: boolean;
  onDelete?: () => Promise<void>;
  isDeleting: boolean;
}

function CommentItem({ comment, isOwn, onDelete, isDeleting }: CommentItemProps) {
  const author =
    typeof comment.userId === 'string' ? null : comment.userId;
  const date = new Date(comment.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <li className="bg-white border border-stone-100 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="font-medium text-stone-800 text-sm">
            {author?.name ?? 'Anonim'}
            {isOwn && (
              <span className="ml-2 text-xs text-amber-600 font-normal">(sen)</span>
            )}
          </div>
          <div className="text-xs text-stone-400">{date}</div>
        </div>
        <div className="text-amber-400 text-sm shrink-0" aria-label={`${comment.rating} yıldız`}>
          {'★'.repeat(comment.rating)}
          <span className="text-stone-300">{'★'.repeat(5 - comment.rating)}</span>
        </div>
      </div>
      {comment.text && (
        <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
          {comment.text}
        </p>
      )}
      {isOwn && onDelete && (
        <div className="mt-3 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Yorumunuzu silmek istediğinize emin misiniz?')) {
                onDelete();
              }
            }}
            disabled={isDeleting}
            className="text-xs text-rose-600 hover:text-rose-700 disabled:opacity-60 font-medium"
          >
            {isDeleting ? 'Siliniyor...' : 'Yorumu sil'}
          </button>
        </div>
      )}
    </li>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg" aria-hidden="true">{icon}</span>
      <span className="font-semibold text-stone-800">{value}</span>
      <span className="text-xs text-stone-400">{label}</span>
    </div>
  );
}

// Açılır-kapanır besin değerleri tablosu (C.1 — Zehra)
// multiplier prop'u: Furkan Y.'nin B.4 porsiyon çarpanı göreviyle koordineli
function NutritionAccordion({
  nutrition,
  multiplier = 1,
}: {
  nutrition: RecipeNutrition;
  multiplier?: number;
}) {
  const [open, setOpen] = useState(false);

  const scaled = (val?: number) =>
    val != null ? Math.round(val * multiplier) : null;

  const rows: { label: string; value: number | null; unit: string; color: string }[] = [
    { label: 'Protein',       value: scaled(nutrition.protein),  unit: 'g', color: 'bg-blue-400'   },
    { label: 'Karbonhidrat',  value: scaled(nutrition.carbs),    unit: 'g', color: 'bg-amber-400'  },
    { label: 'Yağ',           value: scaled(nutrition.fat),      unit: 'g', color: 'bg-rose-400'   },
  ].filter((r) => r.value != null);

  if (rows.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-stone-100 overflow-hidden">
      {/* Akordion başlık */}
      <button
        id="nutrition-accordion-toggle"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="nutrition-accordion-body"
        className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 hover:bg-amber-50 transition-colors text-sm font-medium text-stone-700"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true">📊</span>
          Besin Değerleri
          {nutrition.calories != null && (
            <span className="text-xs font-normal text-stone-400">
              (≈ {scaled(nutrition.calories)} kcal/porsiyon)
            </span>
          )}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Akordion gövdesi */}
      {open && (
        <div
          id="nutrition-accordion-body"
          role="region"
          aria-labelledby="nutrition-accordion-toggle"
          className="px-4 py-4 bg-white"
        >
          <p className="text-xs text-stone-400 mb-3">
            Tahmini değerler — porsiyon başı (1 kişilik)
          </p>
          <ul className="space-y-2.5">
            {rows.map((row) => (
              <li key={row.label} className="flex items-center gap-3 text-sm">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${row.color}`}
                  aria-hidden="true"
                />
                <span className="w-28 text-stone-600">{row.label}</span>
                <div className="flex-1 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  {/* Göstermek için sabit max: protein/karbonhidrat 100g, yağ 80g */}
                  <div
                    className={`h-full rounded-full ${row.color} opacity-70`}
                    style={{
                      width: `${Math.min(100, Math.round(((row.value ?? 0) / (row.label === 'Yağ' ? 80 : 100)) * 100))}%`,
                    }}
                    aria-hidden="true"
                  />
                </div>
                <span className="font-semibold text-stone-800 w-14 text-right">
                  {row.value} {row.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function RecipeDetailSkeleton() {
  return (
    <main className="min-h-screen bg-stone-50 pb-16 animate-pulse">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <div className="h-4 bg-stone-200 rounded w-24 mb-4" />
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-100">
          <div className="w-full aspect-[16/9] max-h-80 bg-amber-100" />
          <div className="p-6 sm:p-8 space-y-4">
            <div className="h-3 bg-stone-200 rounded w-24" />
            <div className="h-6 bg-stone-200 rounded w-3/4" />
            <div className="h-3 bg-stone-100 rounded w-full" />
            <div className="h-3 bg-stone-100 rounded w-5/6" />
            <div className="h-px bg-stone-100 my-4" />
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-3 bg-stone-100 rounded" />
                ))}
              </div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-3 bg-stone-100 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
