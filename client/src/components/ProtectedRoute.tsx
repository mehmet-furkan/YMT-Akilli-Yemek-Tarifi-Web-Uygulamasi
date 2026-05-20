import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Korumalı rota bileşeni.
 *
 * - Yükleniyor: Beyaz ekran yerine küçük bir spinner gösterir
 *   (sayfa yenilendiğinde /auth/me çağrısı tamamlanana kadar bekler).
 * - Oturum açılmamış: /login'e yönlendirir.
 * - Oturum açılmış: iç içe rotaları (<Outlet />) render eder.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-loading" role="status" aria-label="Yükleniyor">
        <div className="auth-spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // replace: history stack'e yeni giriş eklemeden yönlendirir
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
