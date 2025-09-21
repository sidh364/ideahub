import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4 font-bold text-center">Register</h2>
        <button
          type="button"
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 mb-2"
          onClick={async () => {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
            if (error) setError(error.message);
          }}
        >
          Continue with Google
        </button>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mb-2 p-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mb-4 p-2 border rounded" />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Register</button>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        <button type="button" className="w-full mt-2 text-blue-600" onClick={() => router.push('/auth/login')}>Back to Login</button>
      </form>
    </div>
  );
}
