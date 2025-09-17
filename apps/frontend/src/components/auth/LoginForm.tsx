// File Path: apps/frontend/src/components/auth/LoginForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, LoginCredentials } from '@/lib/definitions';
import { Button } from '@/components/ui/Button';

export const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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

  const inputClass = "w-full px-4 py-3 bg-[#FFF7F2] rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-3xl font-bold mb-6 text-center">Login Now</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="budi.siregar@gmail.com"
            {...register('email')}
            className={inputClass}
          />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        
        <div className="relative">
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="********************"
            {...register('password')}
            className={inputClass}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5"
          >
            {/* Simple SVG icon for visibility toggle */}
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        
        <div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Logging in...' : 'Next'}
          </Button>
        </div>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have a Rentverse account yet?{' '}
        <Link href="/register" className="font-medium text-orange-500 hover:text-orange-400">
          Register
        </Link>
      </p>
    </div>
  );
};

