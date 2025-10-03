// File Path: apps/frontend/src/app/(main)/page.tsx
import { Hero } from '@/features/home/components/Hero';
import { Stats } from '@/features/home/components/Stats';
import { FeaturedProperties } from '@/features/home/components/FeaturedProperties';

export default function HomePage() {
  return (
    <div className="bg-white">
      <Hero />
      <Stats />
      <FeaturedProperties />
    </div>
  );
}

