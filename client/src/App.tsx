import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import IngredientSearchPage from "./pages/IngredientSearchPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";

function App() {
  return (
    <Routes>
      {/* ── Genel rotalar (oturum gerekmez) ─────────────────────────── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Korumalı rotalar (oturum gerekir) ───────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search-by-ingredients" element={<IngredientSearchPage />} />
        <Route path="/tarifler/:id" element={<RecipeDetailPage />} />
      </Route>

      {/* ── Tanımsız rotalar → ana sayfaya yönlendir ────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;



//Favori icin gebişletme->

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute"; // Emre'nin yolu

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import IngredientSearchPage from "./pages/IngredientSearchPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import ProfilePage from "./pages/ProfilePage";
import RecommendationPage from "./pages/RecommendationPage";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/oneri" element={<RecommendationPage />} />

            {/* Protected — Outlet pattern */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/search-by-ingredients" element={<IngredientSearchPage />} />
              <Route path="/tarifler/:id" element={<RecipeDetailPage />} />
              <Route path="/profil" element={<ProfilePage />} />  {/* ← eklendi */}
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}


