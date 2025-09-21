"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import IdeaCard, { Idea } from './IdeaCard';

export default function IdeaFeed() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setIdeas(data);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Idea Feed</h2>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span>Loading ideas...</span>
        </div>
      ) : (
        <ul>
          {ideas.map(idea => (
            <li key={idea.id}>
              <IdeaCard idea={idea} onUpvote={fetchIdeas} onComment={fetchIdeas} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
