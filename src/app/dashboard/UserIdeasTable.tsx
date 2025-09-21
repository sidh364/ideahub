import { useEffect, useState } from 'react';
"use client";
import { supabase } from '../../lib/supabaseClient';
import { useUser } from '../../lib/useUser';

export default function UserIdeasTable() {
  const { user } = useUser();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchUserIdeas();
  }, [user]);

  const fetchUserIdeas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ideas')
      .select('*, votes(id), comments(id)')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) {
      setIdeas(data);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mt-8">
      <h2 className="text-xl font-bold mb-4">Your Submitted Ideas</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Upvotes</th>
              <th className="p-2 border">Comments</th>
              <th className="p-2 border">Created</th>
            </tr>
          </thead>
          <tbody>
            {ideas.map(idea => (
              <tr key={idea.id}>
                <td className="p-2 border">{idea.title}</td>
                <td className="p-2 border">{idea.votes ? idea.votes.length : 0}</td>
                <td className="p-2 border">{idea.comments ? idea.comments.length : 0}</td>
                <td className="p-2 border">{new Date(idea.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
