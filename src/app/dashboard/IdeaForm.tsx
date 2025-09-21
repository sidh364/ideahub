"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useUser } from '../../lib/useUser';

// Dummy AI validation function (replace with OpenAI API call)
async function validateIdeaAI(title: string, description: string): Promise<boolean> {
  // Replace with actual API call to OpenAI or LLM
  return title.trim().length > 5 && description.trim().length > 10;
}

export default function IdeaForm({ onIdeaPosted }: { onIdeaPosted: () => void }) {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const isValid = await validateIdeaAI(title, description);
    if (!isValid) {
      setError('Idea is not clear or is too short.');
      setLoading(false);
      return;
    }
    const { error: dbError } = await supabase.from('ideas').insert([
      {
        title,
        description,
        tags,
        author_id: user.id,
        author_email: user.email,
        created_at: new Date().toISOString(),
      }
    ]);
    if (dbError) {
      setError(dbError.message);
    } else {
      setTitle('');
      setDescription('');
      setTags('');
      if (onIdeaPosted) onIdeaPosted();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Share a New Idea</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={e => setTags(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Posting...
          </>
        ) : 'Post Idea'}
      </button>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </form>
  );
}
