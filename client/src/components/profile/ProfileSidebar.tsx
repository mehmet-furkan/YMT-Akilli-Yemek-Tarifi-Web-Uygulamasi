export function ProfileSidebar({ user }: { user: any }) {
  const joinDate = new Date(user?.createdAt || Date.now()).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-lg font-bold text-stone-800 mb-4">Hakkında</h3>
        
        {user?.bio ? (
          <p className="text-stone-600 text-sm leading-relaxed mb-6">{user.bio}</p>
        ) : (
          <p className="text-stone-400 text-sm italic mb-6">Henüz bir biyografi eklenmemiş.</p>
        )}
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-stone-600 text-sm">
            <span role="img" aria-label="city">📍</span>
            <span>{user?.city || "Belirtilmemiş"}</span>
          </div>
          <div className="flex items-center gap-3 text-stone-600 text-sm">
            <span role="img" aria-label="join-date">📅</span>
            <span>{joinDate} tarihinde katıldı</span>
          </div>
        </div>
      </div>
      
      {/* Mock Özet Kutuları */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-md font-bold text-stone-800 mb-2">Tarif Defteri (0)</h3>
        <p className="text-xs text-stone-500">Henüz tarif eklenmemiş.</p>
      </div>
    </div>
  );
}
