// File Path: apps/frontend/src/components/auth/AuthLayout.tsx
import Image from 'next/image';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex text-gray-800">
      {/* Left side with background image and text */}
      <div className="relative hidden lg:flex w-1/2 items-center justify-center">
        <Image
          src="/login-bg.jpg"
          alt="Comfortable modern living room"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="relative z-10 p-12 max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-lg">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right side with the form, passed in as children */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        {children}
      </div>
    </div>
  );
};
