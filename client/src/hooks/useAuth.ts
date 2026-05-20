import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "../contexts/AuthContext";

/**
 * AuthContext'e erişmek için kullanılan özel hook.
 *
 * Kullanım:
 *   const { user, isAuthenticated, login, logout, me } = useAuth();
 *
 * NOT: Bu hook yalnızca <AuthProvider> altındaki bileşenler içinde çağrılmalıdır.
 * Aksi hâlde hata fırlatır.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth hook'u bir <AuthProvider> bileşeni içinde kullanılmalıdır."
    );
  }

  return context;
}
