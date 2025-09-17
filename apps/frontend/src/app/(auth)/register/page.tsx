// File Path: apps/frontend/src/app/(auth)/register/page.tsx
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const title = "Create Your Rentverse Account";
  const subtitle = "Join our community to find your next home or list your property with ease. Let's get you started.";

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      <RegisterForm />
    </AuthLayout>
  );
}

