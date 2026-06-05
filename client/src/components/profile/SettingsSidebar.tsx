import { Link, useSearchParams } from 'react-router-dom';

const SETTINGS_TABS = [
  { id: 'profile', label: 'Hesap Ayarları' },
  { id: 'diet', label: 'Beslenme Tercihleri' },
  { id: 'password', label: 'Şifre Değiştir' },
  { id: 'email', label: 'E-posta Değiştir' },
  { id: 'notifications', label: 'Bildirim Ayarları' },
];

export function SettingsSidebar() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
      <h3 className="text-lg font-bold text-stone-800 mb-4 pb-2 border-b border-stone-100">
        Ayarlar
      </h3>
      <ul className="space-y-1.5">
        {SETTINGS_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <li key={tab.id}>
              <Link
                to={`/profil/ayarlar?tab=${tab.id}`}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-100 text-amber-900 shadow-sm'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
