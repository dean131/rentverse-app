// File Path: apps/frontend/src/components/home/FeaturedProperties.tsx
'use client';

import { useState, useEffect } from 'react';
// CORRECTED: Changed the import path to use the correct alias
import { PropertyCard } from '@/components/home/PropertyCard';
import { getPublicProperties } from '@/services/propertyService';
import { PropertyWithLister } from '@/lib/definitions';

export const FeaturedProperties = () => {
  const [properties, setProperties] = useState<PropertyWithLister[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getPublicProperties();
        const formattedData = data.map(p => ({
            ...p,
            imageUrl: p.images[0]?.imageUrl || 'https://placehold.co/600x400/orange/white?text=Rentverse'
        }));
        setProperties(formattedData);
      } catch (err) {
        setError('Failed to load properties.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Find the property that defines your lifestyle</h2>
        {isLoading && <p className="mt-8">Loading properties...</p>}
        {error && <p className="mt-8 text-red-600">{error}</p>}
        {!isLoading && !error && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

