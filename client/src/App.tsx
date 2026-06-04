import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navbar } from "./components/ui/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import IngredientSearchPage from "./pages/IngredientSearchPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import ProfilePage from "./pages/ProfilePage";
import RecommendationPage from "./pages/RecommendationPage";
import FavoritesPage from "./pages/FavoritesPage";

// Pages where the Navbar should be hidden — login/register feel cleaner
// without a top nav, and the user has nothing to navigate to until they auth.
const NAVBAR_HIDDEN_ROUTES = new Set(["/login", "/register"]);

function App() {
  const location = useLocation();
  const showNavbar = !NAVBAR_HIDDEN_ROUTES.has(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* ── Genel rotalar (oturum gerekmez) ─────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oneri" element={<RecommendationPage />} />

        {/* ── Korumalı rotalar (oturum gerekir) ───────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search-by-ingredients" element={<IngredientSearchPage />} />
          <Route path="/tarifler/:id" element={<RecipeDetailPage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/favoriler" element={<FavoritesPage />} />
        </Route>

        {/* ── Tanımsız rotalar → ana sayfaya yönlendir ────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
