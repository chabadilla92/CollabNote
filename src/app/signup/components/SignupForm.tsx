'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation.js';
import supabase from '@/lib/supabase/client.ts';
import { signUpSchema } from '@/schemas/signup.ts';
import { z } from 'zod';
import Input from '@/components/ui/Input.tsx';

const SignupForm = () => {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = async () => {
    setError(null);
    setLoading(true);

    try {
      signUpSchema.parse({ name, email, password });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.errors[0].message);
        setLoading(false);
        return;
      }
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      console.error('Sign-up error:', signUpError);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push('/login');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSignUp();
    }
  };

  return (
    <div className='flex flex-1 justify-center'>
      <div className='flex flex-col gap-2 p-6 rounded-md h-fit'>
        <h1 className='text-xl font-extrabold text-center'>
          Create an Account
        </h1>

        <div className='flex flex-col gap-2'>
          <Input
            type='name'
            placeholder='Full Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {error && (
          <div className='text-center text-xs text-red-500'>{error}</div>
        )}

        <button
          className='bg-blue-300 border-2 rounded-md border-blue-300 text-white text-md h-10 cursor-pointer hover:bg-blue-400 hover:border-blue-400'
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        <div className='text-center text-sm'>
          <p>
            Already have an account?{' '}
            <a href='/login' className='text-blue-300'>
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
