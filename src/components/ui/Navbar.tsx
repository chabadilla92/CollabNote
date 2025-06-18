'use client';

import { useState } from 'react';
import Link from 'next/link.js';
import { Home } from 'lucide-react';
import LogoutButton from '../auth/LogoutButton.tsx';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className='w-16 bg-gray-800 text-white flex flex-col items-center py-4 space-y-6 h-full fixed left-0 top-0'>
      {/* Home Button */}
      <Link href={`/dashboard`}>
        <div className='hover:bg-gray-700 p-2 rounded cursor-pointer'>
          <Home className='w-4 h-4' />
        </div>
      </Link>

      {/* Logout Button */}
      <div className='relative'>
        <LogoutButton />
      </div>
    </div>
  );
};

export default Navbar;
