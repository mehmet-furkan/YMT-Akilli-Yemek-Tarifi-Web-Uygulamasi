import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../lib/axios";
import { useAuth } from "../hooks/useAuth";
import type { ApiResponse } from "../contexts/AuthContext";

const registerSchema = z
  .object({
    name: z.string().min(2, "Ad en az 2 karakter olmalıdır.").max(50),
    email: z.string().min(1, "E-posta zorunludur.").email("Geçerli e-posta giriniz."),
    password: z
      .string()
      .min(6, "Şifre en az 6 karakter olmalıdır.")
      .regex(/[A-Z]/, "En az bir büyük harf içermeli.")
      .regex(/[0-9]/, "En az bir rakam içermeli."),
    confirmPassword: z.string().min(1, "Şifre tekrarı zorunludur."),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Şifreler eşleşmiyor.",
  });

type RegisterFormData = z.infer<typeof registerSchema>;
interface RegisterResponseData { _id: string; name: string; email: string; token: string; }

// ─── Paylaşılan stiller ───────────────────────────────────────────────────────

const baseInput: React.CSSProperties = {
  background: "rgba(15,23,42,0.7)",
  border: "1.5px solid #334155",
  borderRadius: "12px",
  padding: "12px 16px",
  fontSize: "15px",
  color: "#e2e8f0",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [btnHover, setBtnHover] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (formData: RegisterFormData) => {
    setServerError(null);
    try {
      const { name, email, password } = formData;
      const res = await apiClient.post<ApiResponse<RegisterResponseData>>("/auth/register", { name, email, password });
      if (!res.data.success) { setServerError("Kayıt başarısız."); return; }
      await login({ email, password });
      navigate("/");
    } catch (err: unknown) {
      setServerError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Bir hata oluştu."
      );
    }
  };

  const inp = (field: string, hasErr: boolean): React.CSSProperties => ({
    ...baseInput,
    ...(hasErr ? { borderColor: "rgba(248,113,113,0.6)", background: "rgba(248,113,113,0.05)" } : {}),
    ...(focused === field && !hasErr ? { borderColor: "#f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.15)" } : {}),
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1a1040 50%,#0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "440px", background: "rgba(30,41,59,0.85)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: "24px", padding: "40px 36px", boxShadow: "0 25px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.05) inset", backdropFilter: "blur(20px)" }}>
        
        {/* Başlık */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span style={{ fontSize: "52px", display: "block", marginBottom: "16px", filter: "drop-shadow(0 4px 12px rgba(249,115,22,0.4))" }}>🍽️</span>
          <h1 style={{ fontSize: "26px", fontWeight: 800, background: "linear-gradient(90deg,#fb923c,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            Hesap Oluştur
          </h1>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Akıllı tarif dünyasına katılmak için kayıt olun.</p>
        </div>

        {serverError && (
          <div role="alert" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", color: "#fca5a5", marginBottom: "20px" }}>
            ⚠️ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Ad */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label htmlFor="register-name" style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1" }}>Ad Soyad</label>
            <input id="register-name" type="text" autoComplete="name" placeholder="Adınız Soyadınız" style={inp("name", !!errors.name)} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} {...register("name")} />
            {errors.name && <p style={{ fontSize: "12px", color: "#f87171" }}>⚠ {errors.name.message}</p>}
          </div>

          {/* E-posta */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label htmlFor="register-email" style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1" }}>E-posta</label>
            <input id="register-email" type="email" autoComplete="email" placeholder="ornek@mail.com" style={inp("email", !!errors.email)} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} {...register("email")} />
            {errors.email && <p style={{ fontSize: "12px", color: "#f87171" }}>⚠ {errors.email.message}</p>}
          </div>

          {/* Şifre */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label htmlFor="register-password" style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1" }}>Şifre</label>
            <input id="register-password" type="password" autoComplete="new-password" placeholder="Min. 6 karakter, büyük harf, rakam" style={inp("password", !!errors.password)} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} {...register("password")} />
            {errors.password
              ? <p style={{ fontSize: "12px", color: "#f87171" }}>⚠ {errors.password.message}</p>
              : <p style={{ fontSize: "11px", color: "#475569" }}>En az 6 karakter, 1 büyük harf, 1 rakam.</p>}
          </div>

          {/* Şifre tekrar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label htmlFor="register-confirm" style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1" }}>Şifre Tekrar</label>
            <input id="register-confirm" type="password" autoComplete="new-password" placeholder="Şifrenizi tekrar giriniz" style={inp("confirmPassword", !!errors.confirmPassword)} onFocus={() => setFocused("confirmPassword")} onBlur={() => setFocused(null)} {...register("confirmPassword")} />
            {errors.confirmPassword && <p style={{ fontSize: "12px", color: "#f87171" }}>⚠ {errors.confirmPassword.message}</p>}
          </div>

          {/* Buton */}
          <button
            id="register-submit"
            type="submit"
            disabled={isSubmitting}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", border: "none", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: 700, cursor: isSubmitting ? "not-allowed" : "pointer", marginTop: "4px", boxShadow: btnHover ? "0 6px 28px rgba(249,115,22,0.5)" : "0 4px 20px rgba(249,115,22,0.35)", opacity: isSubmitting ? 0.7 : 1, transform: btnHover && !isSubmitting ? "translateY(-1px)" : "none", transition: "all 0.15s", letterSpacing: "0.3px" }}
          >
            {isSubmitting ? "⏳ Kayıt yapılıyor…" : "Kayıt Ol →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#64748b" }}>
          Zaten hesabınız var mı?{" "}
          <Link to="/login" style={{ color: "#fb923c", textDecoration: "none", fontWeight: 600 }}>Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}
