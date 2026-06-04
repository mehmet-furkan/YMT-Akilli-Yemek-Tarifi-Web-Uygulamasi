import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Navbar — top-level nav bar shown on every page (except /login, /register).
 *
 * Auth: pulls user/logout from AuthContext. On logout the JWT is cleared
 * (sessionStorage) and the user is redirected to /login.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-amber-600' : 'text-stone-600 hover:text-amber-600'
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
          <NavLink to="/oneri" className={navLinkClass}>
            Öneri
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/favoriler" className={navLinkClass}>
                Favorilerim
              </NavLink>
              <NavLink to="/profil" className={navLinkClass}>
                Profilim
              </NavLink>
            </>
          )}
        </div>

        {/* Desktop auth actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none rounded-full ring-2 ring-transparent hover:ring-amber-200 transition-all"
                aria-label="Profil Menüsü"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white font-bold shadow-sm">
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50 flex flex-col transform opacity-100 scale-100 transition-all origin-top-right">
                  <div className="px-4 py-2 border-b border-stone-100 mb-1">
                    <p className="text-sm font-bold text-stone-800 truncate">{user?.name}</p>
                    <p className="text-xs text-stone-500 truncate">
                      {user?.username ? `@${user.username}` : user?.email}
                    </p>
                  </div>
                  <Link to="/profil" onClick={() => setDropdownOpen(false)} className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors flex items-center gap-2">
                    Profilim
                  </Link>
                  <Link to="/profil?tab=favorites" onClick={() => setDropdownOpen(false)} className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors flex items-center gap-2">
                    Tarif Defterim
                  </Link>
                  <Link to="/profil?tab=my-recipes" onClick={() => setDropdownOpen(false)} className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors flex items-center gap-2">
                    Tariflerim
                  </Link>
                  <div className="border-t border-stone-100 my-1"></div>
                  <Link to="/profil/ayarlar" onClick={() => setDropdownOpen(false)} className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors flex items-center gap-2">
                    Ayarlar
                  </Link>
                  <Link to="/profil/ayarlar?tab=password" onClick={() => setDropdownOpen(false)} className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors flex items-center gap-2">
                    Şifre Değiştir
                  </Link>
                  <div className="border-t border-stone-100 my-1"></div>
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); handleLogout(); }}
                    className="px-4 py-2 text-sm text-rose-600 font-medium hover:bg-rose-50 transition-colors text-left w-full flex items-center gap-2"
                  >
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-full transition-colors"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
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
            to="/oneri"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Öneri
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink
                to="/favoriler"
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                Favorilerim
              </NavLink>
              <NavLink
                to="/profil"
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                Profilim
              </NavLink>
            </>
          )}
          <div className="border-t border-amber-100 pt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                {user?.name && (
                  <span className="text-xs text-stone-500">
                    Giriş:{' '}
                    <span className="font-medium text-stone-700">{user.name}</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-rose-600 text-left"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-stone-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
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
