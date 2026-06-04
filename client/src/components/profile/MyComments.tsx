import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';

export function MyComments() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get('/users/me/comments');
        if (data.success) setComments(data.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-stone-100 animate-pulse rounded-xl" />)}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-16 text-stone-400">
        <div className="text-5xl mb-4" role="img" aria-label="chat">💬</div>
        <p className="font-medium text-stone-500">Henüz hiç yorum yapmadın</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <div key={comment._id} className="bg-stone-50 p-4 rounded-xl border border-stone-200">
          <Link to={`/tarifler/${comment.recipeId._id}`} className="font-medium text-stone-800 hover:text-amber-600 block mb-2">
            {comment.recipeId.title} adlı tarife yorum yaptın:
          </Link>
          <div className="flex items-center gap-1 text-amber-500 mb-2">
            {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
          </div>
          <p className="text-stone-600 text-sm">{comment.text}</p>
        </div>
      ))}
    </div>
  );
}
