import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SettingsSidebar } from "../components/profile/SettingsSidebar";
import { AccountSettingsForm } from "../components/profile/AccountSettingsForm";
import { DietaryPreferencesForm } from "../components/profile/DietaryPreferencesForm";
import { ChangePasswordForm } from "../components/profile/ChangePasswordForm";

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderActiveForm = () => {
    switch (activeTab) {
      case 'profile':
        return <AccountSettingsForm />;
      case 'diet':
        return <DietaryPreferencesForm />;
      case 'password':
        return <ChangePasswordForm />;
      case 'email':
      case 'notifications':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 text-center text-stone-500 py-16">
            <h2 className="text-xl font-bold text-stone-800 mb-4 capitalize">{activeTab} Ayarları</h2>
            Bu özellik yakında eklenecektir.
          </div>
        );
      default:
        return <AccountSettingsForm />;
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
             <div className="sticky top-24">
                <SettingsSidebar />
             </div>
          </aside>
          
          {/* Main Content */}
          <div className="flex-1">
             {renderActiveForm()}
          </div>
        </div>
      </div>
    </main>
  );
}
