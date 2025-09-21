import { useUser } from '../../lib/useUser';
"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import IdeaForm from './IdeaForm';
import IdeaFeed from './IdeaFeed';
import UserIdeasTable from './UserIdeasTable';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}</h1>
        <IdeaForm onIdeaPosted={() => {}} />
        <IdeaFeed />
        <UserIdeasTable />
      </div>
    </>
  );
}
