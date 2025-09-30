// File Path: apps/frontend/src/app/(auth)/login/page.tsx
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  const title = "Welcome to Rentverse";
  const subtitle = "Realize your dream home. We craft spaces that are functional, inspiring joy, tranquility, and connection.";

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      <LoginForm />
    </AuthLayout>
  );
}

