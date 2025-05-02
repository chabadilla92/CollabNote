'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../lib/supabase/client';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    // const { user, error: loginError } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // })

    // if (loginError) {
    //   setError(loginError.message)
    // } else {
    //   console.log('Logged in as:', user)
    //   router.push('/')
    // }
  };

  return (
    <div className='flex items-center justify-center align-center self-stretch h-[80dvh]'>
      <div className="flex flex-col">
        <h1 className="text-lg font-extrabold">Welcome to CollabNote</h1>
        <div className='input-group'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='input-group'>
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className='error-message'>{error}</div>}
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
