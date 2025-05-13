'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import supabase from '../../../lib/supabase/client';

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
      } else {
        router.push('/login');
      }
    });
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex items-center justify-center flex-col'>
      <h1 className='text-xl font-extrabold mb-4'>
        Welcome to the Dashboard, {user?.email}
      </h1>
      <p>Your personalized landing page</p>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/login');
        }}
        className='mt-4 px-4 py-2 bg-red-500 text-white rounded'
      >
        Sign Out
      </button>
    </div>
  );
};

export default DashboardPage;
