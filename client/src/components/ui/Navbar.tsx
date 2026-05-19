import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

/**
 * Navbar
 *
 * Emre'nin AuthContext'i hazır olunca `useAuth()` ile replace edilecek.
 * Şimdilik localStorage token varlığını kontrol eder.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Geçici auth kontrolü — Emre'nin AuthContext'i entegre edilince değişecek
  const isLoggedIn = Boolean(localStorage.getItem('nck_token'));

  const handleLogout = () => {
    localStorage.removeItem('nck_token');
    setMenuOpen(false);
    navigate('/');
    // Sayfayı zorla yenile: React state yönetimi olmadığından gerekli
    window.location.reload();
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-amber-600'
        : 'text-stone-600 hover:text-amber-600'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-amber-50/95 backdrop-blur-sm border-b border-amber-100">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-amber-700 font-bold text-lg tracking-tight shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-2xl" aria-hidden="true">🍳</span>
          <span className="hidden sm:inline">Night Code Kitchen</span>
          <span className="sm:hidden">NCK</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Ana Sayfa
          </NavLink>
          <NavLink to="/tarifler" className={navLinkClass}>
            Tarifler
          </NavLink>
          {isLoggedIn && (
            <NavLink to="/profil" className={navLinkClass}>
              Profilim
            </NavLink>
          )}
        </div>

        {/* Desktop auth actions */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-stone-600 hover:text-rose-600 transition-colors"
            >
              Çıkış Yap
            </button>
          ) : (
            <>
              <Link
                to="/giris"
                className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                to="/kayit"
                className="text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-full transition-colors"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-amber-100 transition-colors"
          aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75zm0 10.5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75zM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-amber-100 bg-amber-50 px-4 py-3 flex flex-col gap-3">
          <NavLink
            to="/"
            end
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Ana Sayfa
          </NavLink>
          <NavLink
            to="/tarifler"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Tarifler
          </NavLink>
          {isLoggedIn && (
            <NavLink
              to="/profil"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Profilim
            </NavLink>
          )}
          <div className="border-t border-amber-100 pt-3 flex flex-col gap-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-rose-600 text-left"
              >
                Çıkış Yap
              </button>
            ) : (
              <>
                <Link
                  to="/giris"
                  className="text-sm font-medium text-stone-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/kayit"
                  className="text-sm font-semibold bg-amber-500 text-white text-center py-2 rounded-full"
                  onClick={() => setMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
