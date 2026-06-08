import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";

interface GoogleSignInButtonProps {
  onError?: (message: string) => void;
}

/**
 * Login + Register sayfalarında ortak kullanılan Google Sign-In butonu.
 *
 * Google'ın resmi @react-oauth/google paketi üzerinden render edilir.
 * Başarılı bir popup sonucunda credential (ID token JWT) backend'e gönderilir
 * (POST /api/auth/google). Backend yeni user oluşturur veya mevcut user'a
 * googleId ekleyerek account linking yapar.
 *
 * Account linking güvenliği: backend google-auth-library ile token'ı verify
 * eder ve `email_verified` zorunluluğunu kontrol eder.
 */
export function GoogleSignInButton({ onError }: GoogleSignInButtonProps) {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      onError?.("Google kimlik bilgisi alınamadı");
      return;
    }
    setIsLoading(true);
    try {
      await loginWithGoogle(response.credential);
      navigate("/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Google ile giriş başarısız. Lütfen tekrar deneyin.";
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    onError?.("Google ile giriş iptal edildi veya başarısız oldu.");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        opacity: isLoading ? 0.6 : 1,
        pointerEvents: isLoading ? "none" : "auto",
      }}
    >
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="filled_black"
        size="large"
        shape="pill"
        text="signin_with"
        useOneTap={false}
      />
      {isLoading && (
        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
          Giriş yapılıyor…
        </span>
      )}
    </div>
  );
}
