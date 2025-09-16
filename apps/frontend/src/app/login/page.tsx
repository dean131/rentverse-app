import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Left side with background image and text (can be the same as register) */}
      <div className="hidden lg:flex w-1/2 bg-cover bg-center items-center justify-center" style={{ backgroundImage: "url('/register-bg.jpg')" }}>
        <div className="bg-black bg-opacity-50 p-12 rounded-lg text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome Back to RENTVERSE</h1>
          <p className="text-lg">Your next property is just a click away. Sign in to continue.</p>
        </div>
      </div>

      {/* Right side with the form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Sign in to your account</h2>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-gray-600">
            {/* FIXED: Replaced ' with &apos; to escape the character */}
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="font-medium text-orange-600 hover:text-orange-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
