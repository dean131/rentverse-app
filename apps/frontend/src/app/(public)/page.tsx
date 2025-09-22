// File Path: apps/frontend/src/app/(main)/page.tsx
import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';

export default function HomePage() {
  return (
    <div className="bg-white">
      <Hero />
      <Stats />
      <FeaturedProperties />
    </div>
  );
}

