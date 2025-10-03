// File Path: apps/frontend/src/components/ui/SocialIcon.tsx
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  href: string;
  src: string;
  alt: string;
}

export const SocialIcon = ({ href, src, alt }: Props) => (
  <Link 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-gray-400 hover:opacity-80 transition-opacity duration-200"
    aria-label={alt}
  >
    {/* CORRECTED: The Image is now wrapped in a div with a fixed size.
      This ensures all icons, regardless of their original file dimensions,
      are rendered at the exact same size on the page.
    */}
    <div className="relative h-6 w-6">
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="contain" // Ensures the icon fits within the box without being stretched
      />
    </div>
  </Link>
);

