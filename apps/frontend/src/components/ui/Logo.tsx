// File Path: apps/frontend/src/components/ui/Logo.tsx
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

// Reverted to use next/image for a static PNG logo
export const Logo = ({ className }: LogoProps) => (
  <Link href="/" className={`block ${className}`}>
    <Image 
        src="/logo.png" // Assumes you have a logo.png in your /public folder
        alt="Rentverse Logo"
        width={140} // Adjust width as needed
        height={35} // Adjust height as needed
        priority
    />
  </Link>
);

