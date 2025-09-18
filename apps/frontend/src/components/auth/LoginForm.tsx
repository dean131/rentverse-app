// File Path: apps/frontend/src/components/auth/LoginForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import Link from 'next/link';

import { loginSchema, LoginCredentials } from '@/lib/definitions';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { PasswordInputField } from '@/components/ui/PasswordInputField'; // <-- Import the new password component

export const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    setError(null);
    try {
      await login(data);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-3xl font-bold mb-8 text-center">Login Now</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <InputField
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="budi siregar@gmail.com"
          registration={register('email')}
          error={errors.email}
        />

        <PasswordInputField
            label="Password"
            id="password"
            autoComplete="current-password"
            placeholder="******************"
            registration={register('password')}
            error={errors.password}
        />

        {error && <div className="text-sm text-red-600 text-center">{error}</div>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Signing in...' : 'Next'}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-gray-600">
        Don&apos;t have a Rentverse account yet?{' '}
        <Link href="/register" className="font-medium text-orange-400 hover:text-orange-500">
          Register
        </Link>
      </p>
    </div>
  );
};

