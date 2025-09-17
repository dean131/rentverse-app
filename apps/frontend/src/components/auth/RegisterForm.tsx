// File Path: apps/frontend/src/components/auth/RegisterForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { RegisterCredentials, registerSchema } from '@/lib/definitions';
import { Button } from '@/components/ui/Button';

export const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { register: signup } = useAuth(); // Rename to avoid conflict with react-hook-form's register

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
      // Don't send confirmPassword to the backend
      const { confirmPassword, ...submissionData } = data;
      await signup(submissionData);
      // Redirect to login page after successful registration
      router.push('/login?status=success'); 
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          {...register('fullName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        />
        {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
      </div>

      {/* Role Selection */}
      <div className="pt-2">
        <span className="block text-sm font-medium text-gray-700">I am a...</span>
        <div className="mt-2 flex items-center space-x-6">
          <div className="flex items-center">
            <input
              id="role-owner"
              type="radio"
              value="PROPERTY_OWNER"
              {...register('role')}
              className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="role-owner" className="ml-2 block text-sm text-gray-900">
              Property Owner
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="role-tenant"
              type="radio"
              value="TENANT"
              {...register('role')}
              className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="role-tenant" className="ml-2 block text-sm text-gray-900">
              Tenant
            </label>
          </div>
        </div>
        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
      </div>

      {/* Submit Button & Messages */}
      <div className="pt-4">
        {error && <div className="text-red-600 text-sm text-center p-2 mb-4 rounded-md bg-red-50">{error}</div>}
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
};

