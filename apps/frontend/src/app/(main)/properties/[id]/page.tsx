// File Path: apps/frontend/src/app/(main)/properties/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getPropertyById } from '@/services/propertyService';
import { PropertyDetailed } from '@/lib/definitions';
import Image from 'next/image';

// This is the component for the dynamic page.
// The `params` object is automatically passed by Next.js and contains the route parameters.
export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<PropertyDetailed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const propertyId = parseInt(params.id, 10);
    if (isNaN(propertyId)) {
      setError("Invalid property ID.");
      setIsLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(propertyId);
        setProperty(data);
      } catch (err) {
        console.error("Failed to fetch property details:", err);
        setError("Property not found or an error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  if (isLoading) {
    return <div className="text-center py-20">Loading property details...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!property) {
    return <div className="text-center py-20">Property data could not be loaded.</div>;
  }

  // Basic layout to display the fetched data. This can be styled further.
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
      <p className="text-lg text-gray-600 mb-6">{property.address}</p>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {property.images.map(img => (
            <div key={img.imageUrl} className="relative h-80">
                <Image src={img.imageUrl} alt={property.title} layout="fill" objectFit="cover" className="rounded-lg" />
            </div>
        ))}
      </div>
      
      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
            
            <h2 className="text-2xl font-semibold border-b pb-2 mt-8 mb-4">Amenities</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map(amenity => (
                    <li key={amenity.id} className="flex items-center text-gray-700">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        {amenity.name}
                    </li>
                ))}
            </ul>
        </div>

        {/* Sidebar with key info */}
        <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Property Details</h3>
            <div className="space-y-3">
                <p><strong>Price:</strong> {property.rentalPrice ? `Rp ${property.rentalPrice.toLocaleString()}/${property.paymentPeriod?.toLowerCase()}` : 'N/A'}</p>
                <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
                <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
                <p><strong>Size:</strong> {property.sizeSqft} sqft</p>
                <p><strong>Furnishing:</strong> {property.furnishingStatus.replace('_', ' ')}</p>
                <p><strong>Views:</strong> {property.views.map(v => v.name).join(', ')}</p>
            </div>
        </div>
      </div>
    </div>
  );
}

