'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation.js';
import supabase from '@/lib/supabase/client.ts';
import { loginSchema } from '@/schemas/login.ts';
import { z } from 'zod';
import Input from '@/components/ui/Input.tsx';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      loginSchema.parse({ email, password });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.errors[0].message);
        setLoading(false);
        return;
      }
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (loginError) {
      setError(loginError.message);
    } else {
      router.push('/dashboard');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className='flex flex-1 justify-center'>
      <div className='flex flex-col gap-2 p-6 rounded-md h-fit'>
        <h1 className='text-xl font-extrabold text-center'>Log In</h1>
        <div className='flex flex-col gap-2'>
          <Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            onKeyDown={handleKeyDown}
          />
          <Input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            onKeyDown={handleKeyDown}
          />
        </div>
        {error && (
          <div className='text-center text-xs text-red-500'>{error}</div>
        )}

        <button
          className='bg-gray-800 border-2 rounded-md border-gray-800 text-white text-md h-10 cursor-pointer hover:bg-gray-800 hover:bg-gray-800'
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging In...' : 'Log In'}
        </button>

        <div className='text-center text-sm'>
          <p>
            Don&apos;t have an account?{' '}
            <a href='/signup' className='text-blue-500 hover:text-blue-300'>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
