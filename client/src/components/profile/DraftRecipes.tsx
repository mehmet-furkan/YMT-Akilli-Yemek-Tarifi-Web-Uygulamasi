import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { RecipeCard } from '../feature/RecipeCard';

export function DraftRecipes() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await api.get('/users/me/drafts');
        if (data.success) setRecipes(data.data);
      } catch (error) {
        console.error('Failed to fetch drafts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-stone-100 animate-pulse rounded-2xl" />)}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16 text-stone-400">
        <div className="text-5xl mb-4" role="img" aria-label="notebook">📝</div>
        <p className="font-medium text-stone-500">Henüz taslak tarifin yok</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {recipes.map(recipe => <RecipeCard key={recipe._id} recipe={recipe} />)}
    </div>
  );
}
