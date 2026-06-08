import { useEffect, useRef, useState } from "react";

interface ShareMenuProps {
  title: string;
  /** Test/SSR için override; normalde window.location.href */
  url?: string;
}

type Platform = "whatsapp" | "x" | "facebook" | "instagram" | "copy";

/**
 * Tarif paylaşma menüsü.
 *
 * Stats row'unun sol başında "Paylaş" tuşu olarak render edilir. Tıklayınca
 * altta floating popover açılır, içinde 5 platform butonu var:
 *   - WhatsApp (wa.me deep link)
 *   - X / Twitter (intent URL)
 *   - Facebook (sharer URL)
 *   - Instagram (link kopyala + "Story'nde paylaşabilirsin" toast)
 *   - Doğrudan link kopyala
 *
 * Native `navigator.share`'i bilinçli olarak KULLANMIYORUZ — desktop tarayıcılarda
 * çoğunlukla yok ya da sessizce hata veriyor; kullanıcıya tutarlı 5 buton
 * göstermek daha güvenilir UX.
 *
 * Popover dış tıklamayla, Escape ile veya bir platform seçilince kapanır.
 */
export function ShareMenu({ title, url }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedFor, setCopiedFor] = useState<Platform | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const shareText = `${title} — Night Code Kitchen`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  // Outside-click ve Escape ile kapanma
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const copyLink = async (platform: Platform) => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedFor(platform);
      setTimeout(() => setCopiedFor(null), 2500);
    } catch {
      // Tarayıcı clipboard izni vermedi — sessizce geç
    }
  };

  const handleInstagram = () => {
    // Instagram web URL share API'sini desteklemiyor. Link kopyala ve kullanıcıya
    // Story'sinde manuel yapıştırmasını söyle.
    copyLink("instagram");
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center gap-0.5">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Tarifi paylaş"
        className="flex flex-col items-center gap-0.5 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-amber-300 rounded-lg p-1 -m-1"
      >
        <span className="text-lg" aria-hidden="true">📤</span>
        <span className="font-semibold text-stone-800">Paylaş</span>
        <span className="text-xs text-stone-400">Bu tarifi</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-30 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 min-w-[280px]"
        >
          <div className="grid grid-cols-5 gap-2">
            <PlatformButton
              label="WhatsApp"
              href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
              bg="bg-emerald-500 hover:bg-emerald-600"
              onSelect={() => setIsOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.21-1.63A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52ZM12 22a9.9 9.9 0 0 1-5.06-1.38l-.36-.21-3.69.97.99-3.6-.24-.37A9.95 9.95 0 1 1 22 12c0 5.52-4.48 10-10 10Zm5.45-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.78.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46s1.06 2.85 1.21 3.05c.15.2 2.08 3.17 5.04 4.45.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.34Z" />
              </svg>
            </PlatformButton>

            <PlatformButton
              label="X (Twitter)"
              href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
              bg="bg-stone-900 hover:bg-stone-800"
              onSelect={() => setIsOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </PlatformButton>

            <PlatformButton
              label="Facebook"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              bg="bg-blue-600 hover:bg-blue-700"
              onSelect={() => setIsOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95Z" />
              </svg>
            </PlatformButton>

            <button
              type="button"
              onClick={handleInstagram}
              aria-label="Instagram için linki kopyala"
              className="inline-flex flex-col items-center gap-1"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white transition-colors bg-gradient-to-br from-purple-600 via-pink-500 to-amber-400 hover:from-purple-700 hover:via-pink-600 hover:to-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9c-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.94c-3.15 0-3.5.01-4.74.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.26.83-.39.38-.62.75-.83 1.26-.15.39-.33.97-.38 2.04-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.07.23 1.65.38 2.04.2.51.44.88.83 1.26.38.39.75.62 1.26.83.39.15.97.33 2.04.38 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.07-.05 1.65-.23 2.04-.38.51-.2.88-.44 1.26-.83.39-.38.62-.75.83-1.26.15-.39.33-.97.38-2.04.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.07-.23-1.65-.38-2.04-.2-.51-.44-.88-.83-1.26a3.4 3.4 0 0 0-1.26-.83c-.39-.15-.97-.33-2.04-.38-1.24-.06-1.59-.07-4.74-.07Zm0 3.3a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 7.58a2.98 2.98 0 1 0 0-5.96 2.98 2.98 0 0 0 0 5.96Zm5.84-7.78a1.07 1.07 0 1 1-2.14 0 1.07 1.07 0 0 1 2.14 0Z" />
                </svg>
              </span>
              <span className="text-[10px] text-stone-500 leading-tight text-center">Instagram</span>
            </button>

            <button
              type="button"
              onClick={() => copyLink("copy")}
              aria-label="Linki kopyala"
              className="inline-flex flex-col items-center gap-1"
            >
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white transition-colors ${copiedFor === "copy" ? "bg-emerald-500" : "bg-stone-500 hover:bg-stone-600"}`}>
                {copiedFor === "copy" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                )}
              </span>
              <span className="text-[10px] text-stone-500 leading-tight text-center">Kopyala</span>
            </button>
          </div>

          {/* Action feedback */}
          {copiedFor === "instagram" && (
            <p className="text-xs text-emerald-600 mt-3 text-center leading-snug">
              Link kopyalandı. Instagram Story'nde yapıştırabilirsin.
            </p>
          )}
          {copiedFor === "copy" && (
            <p className="text-xs text-emerald-600 mt-3 text-center">
              Link panoya kopyalandı.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Internal: harici link butonu ──────────────────────────────────────────────

interface PlatformButtonProps {
  label: string;
  href: string;
  bg: string;
  onSelect: () => void;
  children: React.ReactNode;
}

function PlatformButton({ label, href, bg, onSelect, children }: PlatformButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onSelect}
      aria-label={`${label} ile paylaş`}
      className="inline-flex flex-col items-center gap-1"
    >
      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white transition-colors ${bg}`}>
        {children}
      </span>
      <span className="text-[10px] text-stone-500 leading-tight text-center">{label}</span>
    </a>
  );
}
