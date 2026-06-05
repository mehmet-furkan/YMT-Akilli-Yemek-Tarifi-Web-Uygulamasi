import { useState, useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../lib/axios";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileSidebar } from "../components/profile/ProfileSidebar";
import { UserTabs } from "../components/profile/UserTabs";
import { MyRecipes } from "../components/profile/MyRecipes";
import { DraftRecipes } from "../components/profile/DraftRecipes";
import { SavedRecipes } from "../components/profile/SavedRecipes";
import { MyComments } from "../components/profile/MyComments";

export default function ProfilePage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  const [stats, setStats] = useState({ recipesCount: 0 });

  useEffect(() => {
    if (user) {
      api.get('/users/me/stats')
        .then(({ data }) => {
          if (data.success) {
            setStats(data.data);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Merge the fetched stats into the user object so ProfileHeader gets the real count
  const enrichedUser = { ...user, recipesCount: stats.recipesCount };

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'profile':
      case 'my-recipes':
        return <MyRecipes />;
      case 'drafts':
        return <DraftRecipes />;
      case 'favorites':
        return <SavedRecipes />;
      case 'comments':
        return <MyComments />;
      default:
        return <MyRecipes />;
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader user={enrichedUser} />
        <UserTabs />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Sidebar (1 column) */}
          <div className="lg:col-span-1">
            <ProfileSidebar user={user} />
          </div>
          
          {/* Right Column: Tab Content (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 min-h-[400px]">
               {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

