import { Link } from 'react-router-dom';

export function ProfileHeader({ user }: { user: any }) {
  const coverPhoto = user?.coverPhoto || "https://images.unsplash.com/photo-1495195134817-a1a2807f6e1b?q=80&w=2000&auto=format&fit=crop";
  const profilePhoto = user?.profilePhoto || "";
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden mb-6">
      {/* Cover Photo */}
      <div 
        className="h-48 md:h-64 w-full bg-stone-200 bg-cover bg-center"
        style={{ backgroundImage: `url(${coverPhoto})` }}
      />
      
      {/* Profile Info */}
      <div className="px-6 py-4 flex flex-col md:flex-row md:items-end gap-6 md:gap-8 -mt-16 md:-mt-20 relative">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-amber-500 flex items-center justify-center text-white text-5xl font-bold shrink-0 overflow-hidden shadow-md">
          {profilePhoto ? (
             <img src={profilePhoto} alt={user?.name} className="w-full h-full object-cover" />
          ) : (
             user?.name?.[0]?.toUpperCase() ?? "?"
          )}
        </div>
        
        <div className="flex-1 pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-stone-800">{user?.name || "Kullanıcı Adı"}</h1>
              <p className="text-stone-500 font-medium">@{user?.username || "kullaniciadi"}</p>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl font-bold text-stone-800">{user?.recipesCount || 0}</p>
                <p className="text-xs text-stone-500 uppercase tracking-wide">Tarif</p>
              </div>
            </div>
            
            <Link
              to="/profil/ayarlar"
              className="inline-flex items-center justify-center w-full md:w-auto px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-full transition-colors"
            >
              Profili Düzenle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
