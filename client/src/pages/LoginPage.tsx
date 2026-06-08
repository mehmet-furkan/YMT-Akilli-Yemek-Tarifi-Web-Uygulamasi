import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../lib/axios";
import { useAuth } from "../hooks/useAuth";
import { GoogleSignInButton } from "../components/feature/GoogleSignInButton";
import type { ApiResponse } from "../contexts/AuthContext";

// ─── Zod Şeması ───────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi zorunludur.")
    .email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginResponseData {
  _id: string;
  name: string;
  email: string;
  token: string;
}

// ─── Stil sabitleri ───────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f172a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  } as React.CSSProperties,

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(30, 41, 59, 0.85)",
    border: "1px solid rgba(249, 115, 22, 0.15)",
    borderRadius: "24px",
    padding: "40px 36px",
    boxShadow:
      "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
    backdropFilter: "blur(20px)",
  } as React.CSSProperties,

  header: {
    textAlign: "center",
    marginBottom: "32px",
  } as React.CSSProperties,

  logo: {
    fontSize: "52px",
    lineHeight: 1,
    display: "block",
    marginBottom: "16px",
    filter: "drop-shadow(0 4px 12px rgba(249,115,22,0.4))",
  } as React.CSSProperties,

  title: {
    fontSize: "26px",
    fontWeight: 800,
    background: "linear-gradient(90deg, #fb923c, #f97316)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: "0 0 8px",
    letterSpacing: "-0.5px",
  } as React.CSSProperties,

  subtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  } as React.CSSProperties,

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  } as React.CSSProperties,

  group: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  } as React.CSSProperties,

  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#cbd5e1",
    letterSpacing: "0.3px",
  } as React.CSSProperties,

  input: {
    background: "rgba(15, 23, 42, 0.7)",
    border: "1.5px solid #334155",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "15px",
    color: "#e2e8f0",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    width: "100%",
    boxSizing: "border-box",
  } as React.CSSProperties,

  inputError: {
    border: "1.5px solid rgba(248,113,113,0.6)",
    background: "rgba(248,113,113,0.05)",
  } as React.CSSProperties,

  errorText: {
    fontSize: "12px",
    color: "#f87171",
    marginTop: "2px",
  } as React.CSSProperties,

  alert: {
    background: "rgba(248,113,113,0.1)",
    border: "1px solid rgba(248,113,113,0.3)",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#fca5a5",
    marginBottom: "4px",
  } as React.CSSProperties,

  btn: {
    background: "linear-gradient(135deg, #f97316, #ea580c)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "4px",
    boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
    transition: "transform 0.15s, box-shadow 0.15s, opacity 0.15s",
    letterSpacing: "0.3px",
  } as React.CSSProperties,

  redirect: {
    textAlign: "center",
    marginTop: "24px",
    fontSize: "14px",
    color: "#64748b",
  } as React.CSSProperties,

  link: {
    color: "#fb923c",
    textDecoration: "none",
    fontWeight: 600,
  } as React.CSSProperties,
} as const;

// ─── Bileşen ──────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [btnHover, setBtnHover] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData: LoginFormData) => {
    setServerError(null);
    try {
      const res = await apiClient.post<ApiResponse<LoginResponseData>>(
        "/auth/login",
        formData
      );
      if (!res.data.success) {
        setServerError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
        return;
      }
      await login(formData);
      navigate("/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Bir hata oluştu. Lütfen tekrar deneyin.";
      setServerError(message);
    }
  };

  const inputStyle = (field: string, hasError: boolean): React.CSSProperties => ({
    ...S.input,
    ...(hasError ? S.inputError : {}),
    ...(focusedField === field && !hasError
      ? { borderColor: "#f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.15)" }
      : {}),
  });

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Başlık */}
        <div style={S.header}>
          <span style={S.logo}>🍽️</span>
          <h1 style={S.title}>Tekrar Hoş Geldiniz</h1>
          <p style={S.subtitle}>Hesabınıza giriş yaparak tariflerinize ulaşın.</p>
        </div>

        {/* Sunucu hatası */}
        {serverError && (
          <div style={{ ...S.alert, marginBottom: "20px" }} role="alert">
            ⚠️ {serverError}
          </div>
        )}

        {/* Google Sign-In */}
        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
          <GoogleSignInButton onError={(msg) => setServerError(msg)} />
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0", color: "#475569", fontSize: "12px", fontWeight: 600, letterSpacing: "0.5px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(148,163,184,0.2)" }} />
          <span>VEYA</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(148,163,184,0.2)" }} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate style={S.form}>
          {/* E-posta */}
          <div style={S.group}>
            <label htmlFor="login-email" style={S.label}>E-posta</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="ornek@mail.com"
              style={inputStyle("email", !!errors.email)}
              onFocus={() => setFocusedField("email")}
              {...register("email")}
              onBlur={(e) => {
                register("email").onBlur(e);
                setFocusedField(null);
              }}
            />
            {errors.email && <p style={S.errorText}>⚠ {errors.email.message}</p>}
          </div>

          {/* Şifre */}
          <div style={S.group}>
            <label htmlFor="login-password" style={S.label}>Şifre</label>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                style={{ ...inputStyle("password", !!errors.password), paddingRight: "40px" }}
                onFocus={() => setFocusedField("password")}
                {...register("password")}
                onBlur={(e) => {
                  register("password").onBlur(e);
                  setFocusedField(null);
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: 0,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p style={S.errorText}>⚠ {errors.password.message}</p>}
          </div>

          {/* Beni Hatırla */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "-4px", marginBottom: "4px" }}>
            <input
              id="login-remember"
              type="checkbox"
              {...register("rememberMe")}
              style={{ accentColor: "#f97316", width: "16px", height: "16px", cursor: "pointer" }}
            />
            <label htmlFor="login-remember" style={{ fontSize: "14px", color: "#cbd5e1", cursor: "pointer", userSelect: "none" }}>
              Beni Hatırla
            </label>
          </div>

          {/* Buton */}
          <button
            id="login-submit"
            type="submit"
            disabled={isSubmitting}
            style={{
              ...S.btn,
              opacity: isSubmitting ? 0.7 : 1,
              transform: btnHover && !isSubmitting ? "translateY(-1px)" : "none",
              boxShadow: btnHover && !isSubmitting
                ? "0 6px 28px rgba(249,115,22,0.5)"
                : S.btn.boxShadow,
            }}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            {isSubmitting ? "⏳ Giriş yapılıyor…" : "Giriş Yap →"}
          </button>
        </form>

        <p style={S.redirect}>
          Hesabınız yok mu?{" "}
          <Link to="/register" style={S.link}>Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}

