import { useState } from 'react';

export function SettingsForm({ user }: { user: any }) {
  const [saving, setSaving] = useState(false);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Mock save delay
    setTimeout(() => setSaving(false), 1000);
  };
  
  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
      <h2 className="text-xl font-bold text-stone-800 mb-6">Hesap Ayarları</h2>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Ad Soyad</label>
            <input type="text" defaultValue={user?.name} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Kullanıcı Adı</label>
            <input type="text" defaultValue={user?.username} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Hakkında</label>
          <textarea rows={4} defaultValue={user?.bio} placeholder="Kendinden bahset..." className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300"></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Şehir</label>
            <select defaultValue={user?.city || ""} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300">
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
            <select defaultValue={user?.gender || ""} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300">
              <option value="">Seçiniz</option>
              <option value="Kadın">Kadın</option>
              <option value="Erkek">Erkek</option>
              <option value="Belirtmek İstemiyorum">Belirtmek İstemiyorum</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Doğum Tarihi</label>
            <input type="date" defaultValue={user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : ""} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300" />
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
