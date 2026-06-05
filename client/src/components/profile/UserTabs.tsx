import { Link, useSearchParams } from 'react-router-dom';

const PROFILE_TABS = [
  { id: 'profile', label: 'Profil' },
  { id: 'my-recipes', label: 'Gönderdiğim Tarifler' },
  { id: 'drafts', label: 'Taslak Tariflerim' },
  { id: 'favorites', label: 'Tarif Defterim' },
  { id: 'comments', label: 'Yorumlarım' },
];

export function UserTabs() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-2 mb-6 overflow-x-auto hide-scrollbar">
      <div className="flex gap-2 min-w-max">
        {PROFILE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              to={`/profil?tab=${tab.id}`}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
