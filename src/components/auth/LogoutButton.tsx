'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const LogoutButton = () => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    router.push('/login'); // immediately redirect
    await supabase.auth.signOut(); // cleanup runs after user is gone
  };

  return (
    <div className='relative'>
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className='hover:bg-gray-700 p-2 rounded cursor-pointer'
      >
        <LogOut className='w-4 h-4' />
      </button>

      {showMenu && (
        <div className='absolute left-12 -top-1 bg-gray-800 text-white shadow-lg border-1 border-gray-800 px-3 py-2'>
          <button onClick={handleLogout} className='hover:cursor-pointer text-sm'>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoutButton;
