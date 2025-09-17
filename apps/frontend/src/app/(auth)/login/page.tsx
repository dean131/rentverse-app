import { LoginForm } from '@/components/auth/LoginForm';
import { Card } from '@/components/ui/Card'; // <-- Updated import path
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card title="Sign in to your account">
        <LoginForm />
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-medium text-orange-600 hover:text-orange-500">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}

