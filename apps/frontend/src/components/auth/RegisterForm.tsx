// File Path: apps/frontend/src/components/auth/RegisterForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import Link from 'next/link';

import { registerSchema, RegisterCredentials } from '@/lib/definitions';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { PasswordInputField } from '@/components/ui/PasswordInputField';

export const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterCredentials) => {
    setError(null);
    try {
      await registerUser(data);
      // On successful registration, redirect to the login page
      router.push('/login');
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
      <h2 className="text-3xl font-bold mb-8 text-center">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          label="Full Name"
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="Budi Siregar"
          registration={register('fullName')}
          error={errors.fullName}
        />
        <InputField
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="budi.siregar@gmail.com"
          registration={register('email')}
          error={errors.email}
        />
        <PasswordInputField
          label="Password"
          id="password"
          autoComplete="new-password"
          placeholder="******************"
          registration={register('password')}
          error={errors.password}
        />
        <PasswordInputField
          label="Confirm Password"
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="******************"
          registration={register('confirmPassword')}
          error={errors.confirmPassword}
        />

        <div>
          <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-1">Account Type</label>
          <select
            id="role"
            {...register('role')}
            className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition"
          >
            <option value="TENANT">I am looking for a property</option>
            <option value="PROPERTY_OWNER">I want to list a property</option>
          </select>
          {errors.role && <p className="mt-2 text-sm text-red-500">{errors.role.message}</p>}
        </div>

        {error && <div className="text-sm text-red-600 text-center">{error}</div>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating Account...' : 'Register'}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-orange-400 hover:text-orange-500">
          Login Now
        </Link>
      </p>
    </div>
  );
};

