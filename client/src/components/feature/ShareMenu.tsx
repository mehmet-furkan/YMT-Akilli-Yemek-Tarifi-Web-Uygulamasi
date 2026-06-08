import { useState } from "react";

interface ShareMenuProps {
  title: string;
  url?: string; // override için (test/SSR), normalde window.location.href
}

/**
 * Tarif paylaşma butonları: WhatsApp, X (Twitter), Facebook ve link kopyala.
 *
 * Modern mobil tarayıcılarda native `navigator.share` daha iyi UX verir;
 * varsa onu kullanır, yoksa ayrı butonlar gösterir. Desktop'ta (Chrome/Edge)
 * `navigator.share` çoğunlukla yoktur — bu durumda fallback render edilir.
 *
 * Link kopyala: `navigator.clipboard.writeText` + 2 saniyelik "Kopyalandı" badge.
 */
export function ShareMenu({ title, url }: ShareMenuProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const shareText = `${title} — Night Code Kitchen`;

  const handleNativeShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) return;
    try {
      await navigator.share({ title: shareText, url: shareUrl });
    } catch {
      // Kullanıcı iptal etti — sessizce geç
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Tarayıcı clipboard'a izin vermedi — kullanıcıya manuel kopyala için fallback yok şu an
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  // Mobil + native share destekleyen tarayıcılarda tek "Paylaş" butonu
  const supportsNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div className="mt-6 pt-6 border-t border-stone-100">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-sm font-semibold text-stone-700">
          📤 Bu tarifi paylaş
        </h3>

        {supportsNativeShare ? (
          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full transition-colors"
            aria-label="Tarifi paylaş"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
            </svg>
            Paylaş
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <ShareButton
              href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
              label="WhatsApp'ta paylaş"
              bg="bg-emerald-500 hover:bg-emerald-600"
            >
              {/* WhatsApp icon — simple chat bubble (license-free path) */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.21-1.63A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52ZM12 22a9.9 9.9 0 0 1-5.06-1.38l-.36-.21-3.69.97.99-3.6-.24-.37A9.95 9.95 0 1 1 22 12c0 5.52-4.48 10-10 10Zm5.45-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.78.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46s1.06 2.85 1.21 3.05c.15.2 2.08 3.17 5.04 4.45.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.34Z" />
              </svg>
            </ShareButton>

            <ShareButton
              href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
              label="X'te paylaş"
              bg="bg-stone-900 hover:bg-stone-800"
            >
              {/* X (Twitter) icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </ShareButton>

            <ShareButton
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              label="Facebook'ta paylaş"
              bg="bg-blue-600 hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95Z" />
              </svg>
            </ShareButton>

            <button
              type="button"
              onClick={handleCopy}
              aria-label="Linki kopyala"
              className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors text-white ${
                copied ? "bg-emerald-500" : "bg-stone-500 hover:bg-stone-600"
              }`}
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
      {copied && (
        <p className="text-xs text-emerald-600 mt-2 text-right">
          Link kopyalandı.
        </p>
      )}
    </div>
  );
}

interface ShareButtonProps {
  href: string;
  label: string;
  bg: string;
  children: React.ReactNode;
}

function ShareButton({ href, label, bg, children }: ShareButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-white transition-colors ${bg}`}
    >
      {children}
    </a>
  );
}
