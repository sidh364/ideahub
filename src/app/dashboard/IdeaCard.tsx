import { useState, useEffect } from 'react';
"use client";
import { supabase } from '../../lib/supabaseClient';
import { useUser } from '../../lib/useUser';

export type Idea = {
  id: string;
  title: string;
  description: string;
  tags?: string;
  author_email: string;
  created_at: string;
  upvotes?: number;
};

export default function IdeaCard({ idea, onUpvote, onComment }: {
  idea: Idea;
  onUpvote: () => void;
  onComment: () => void;
}) {
  const { user } = useUser();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(idea.upvotes || 0);
  const [loading, setLoading] = useState(false);

  // Fetch comments for this idea
  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('idea_id', idea.id)
      .order('created_at', { ascending: true });
    if (!error && data) {
      setComments(data);
    }
  };

  // Check if user has upvoted
  const checkUpvote = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('idea_id', idea.id)
      .eq('user_id', user.id);
    setHasUpvoted(!!(data && data.length > 0));
  };

  // Upvote toggle
  const handleUpvote = async () => {
    if (!user) return;
    setLoading(true);
    if (hasUpvoted) {
      // Remove upvote
      await supabase
        .from('votes')
        .delete()
        .eq('idea_id', idea.id)
        .eq('user_id', user.id);
      setUpvoteCount(upvoteCount - 1);
      setHasUpvoted(false);
    } else {
      // Add upvote
      await supabase
        .from('votes')
        .insert({ idea_id: idea.id, user_id: user.id });
      setUpvoteCount(upvoteCount + 1);
      setHasUpvoted(true);
    }
    if (onUpvote) onUpvote();
    setLoading(false);
  };

  // Add comment
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;
    setLoading(true);
    await supabase
      .from('comments')
      .insert({ idea_id: idea.id, user_id: user.id, content: comment, created_at: new Date().toISOString() });
    setComment('');
    fetchComments();
    if (onComment) onComment();
    setLoading(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchComments();
    checkUpvote();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="mb-6 p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-1">{idea.title}</h3>
      <p className="mb-2">{idea.description}</p>
      <div className="text-sm text-gray-500 mb-1">By: {idea.author_email} | {new Date(idea.created_at).toLocaleString()}</div>
      {idea.tags && (
        <div className="text-xs text-blue-600 mb-1">Tags: {idea.tags}</div>
      )}
      <div className="flex items-center gap-4 mb-2">
        <button
          className={`px-3 py-1 rounded ${hasUpvoted ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={handleUpvote}
          disabled={loading}
        >
          {hasUpvoted ? 'Upvoted' : 'Upvote'} ({upvoteCount})
        </button>
      </div>
      <form onSubmit={handleComment} className="mb-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full p-2 border rounded mb-1"
          disabled={loading}
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded" disabled={loading}>Comment</button>
      </form>
      <div className="mt-2">
        <h4 className="font-semibold mb-1">Comments:</h4>
        <ul>
          {comments.map((c: any) => (
            <li key={c.id} className="text-sm text-gray-700 mb-1">
              <span className="font-bold">{c.user_id}</span>: {c.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
