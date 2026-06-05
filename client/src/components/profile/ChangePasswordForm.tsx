import { useState } from 'react';
import api from '../../lib/axios';

export function ChangePasswordForm() {
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaveStatus("idle");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }
    if (formData.password.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır!");
      return;
    }

    setSaving(true);
    setSaveStatus("idle");
    
    try {
      const { data } = await api.put("/users/profile", { password: formData.password });
      if (data.success) {
        setFormData({ password: '', confirmPassword: '' });
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (err) {
      console.error("Password update error:", err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-stone-800">Şifre Değiştir</h2>
        {saveStatus === "success" && (
          <span className="text-sm font-medium text-emerald-600 animate-[fadeIn_0.3s_ease-out]">
            ✓ Şifre başarıyla güncellendi
          </span>
        )}
        {saveStatus === "error" && (
          <span className="text-sm font-medium text-rose-500">
            ✕ Güncelleme başarısız oldu
          </span>
        )}
      </div>
      
      <div className="space-y-5 max-w-md">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Yeni Şifre</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Yeni Şifre (Tekrar)</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength={6} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300" />
        </div>
      </div>
      
      <div className="mt-8">
        <button type="submit" disabled={saving || !formData.password || formData.password !== formData.confirmPassword} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:bg-stone-200 disabled:text-stone-500">
          {saving ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </button>
      </div>
    </form>
  );
}
