import Link from 'next/link';
import { useUser } from '../../lib/useUser';
import { supabase } from '../../lib/supabaseClient';

export default function Navbar() {
  const { user } = useUser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
      <div className="flex gap-4">
        <Link href="/dashboard" className="font-bold">Dashboard</Link>
        <Link href="/" className="font-bold">Feed</Link>
      </div>
      <div>
        {user ? (
          <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded">Logout</button>
        ) : (
          <Link href="/auth/login" className="bg-white text-blue-600 px-3 py-1 rounded">Login</Link>
        )}
      </div>
    </nav>
  );
}
