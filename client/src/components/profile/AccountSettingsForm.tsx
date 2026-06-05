import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { useAuth } from '../../hooks/useAuth';

export function AccountSettingsForm() {
  const { user, setUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    city: '',
    gender: '',
    birthDate: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        city: user.city || '',
        gender: user.gender || '',
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : ''
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaveStatus("idle");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus("idle");
    
    try {
      const { data } = await api.put("/users/profile", formData);
      if (data.success) {
        setUser({ ...user, ...data.data }); // update auth context
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-stone-800">Hesap Ayarları</h2>
        {saveStatus === "success" && (
          <span className="text-sm font-medium text-emerald-600 animate-[fadeIn_0.3s_ease-out]">
            ✓ Profil başarıyla güncellendi
          </span>
        )}
        {saveStatus === "error" && (
          <span className="text-sm font-medium text-rose-500">
            ✕ Güncelleme başarısız oldu
          </span>
        )}
      </div>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Ad Soyad</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Kullanıcı Adı</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Hakkında</label>
          <textarea rows={4} name="bio" value={formData.bio} onChange={handleChange} placeholder="Kendinden bahset..." className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300"></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Şehir</label>
            <select name="city" value={formData.city} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300">
              <option value="">Seçiniz</option>
              <option value="İstanbul">İstanbul</option>
              <option value="Ankara">Ankara</option>
              <option value="İzmir">İzmir</option>
              <option value="Bursa">Bursa</option>
              <option value="Antalya">Antalya</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Cinsiyet</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300">
              <option value="">Seçiniz</option>
              <option value="Kadın">Kadın</option>
              <option value="Erkek">Erkek</option>
              <option value="Belirtmek İstemiyorum">Belirtmek İstemiyorum</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Doğum Tarihi</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300" />
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button type="submit" disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-colors shadow-sm disabled:opacity-70">
          {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </form>
  );
}
