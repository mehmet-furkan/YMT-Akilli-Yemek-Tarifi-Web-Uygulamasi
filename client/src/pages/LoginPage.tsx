import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../lib/axios";
import { useAuth } from "../hooks/useAuth";
import type { ApiResponse } from "../contexts/AuthContext";

// ─── Zod Şeması ───────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi zorunludur.")
    .email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
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
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              style={inputStyle("password", !!errors.password)}
              onFocus={() => setFocusedField("password")}
              {...register("password")}
              onBlur={(e) => {
                register("password").onBlur(e);
                setFocusedField(null);
              }}
            />
            {errors.password && <p style={S.errorText}>⚠ {errors.password.message}</p>}
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

