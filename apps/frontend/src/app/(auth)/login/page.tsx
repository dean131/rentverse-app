// File Path: apps/frontend/src/app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex text-gray-800">
      {/* Left side with background image and text */}
      <div className="relative hidden lg:flex w-1/2 bg-cover bg-center items-center justify-center">
        {/* Using the Next.js Image component for optimized background images */}
        <Image
          src="/login-bg.jpg" // Corrected the path to use your background image
          alt="Comfortable modern living room"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="relative z-10 p-12 max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Welcome to Rentverse
          </h1>
          <p className="text-lg">
            Realize your dream home. We craft spaces that are functional, inspiring joy, tranquility, and connection.
          </p>
        </div>
      </div>

      {/* Right side with the form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <LoginForm />
      </div>
    </div>
  );
}

