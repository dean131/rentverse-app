// Create a new file at: frontend/src/features/dashboard/components/PropertyOwnerViewLayout.tsx

'use client';

import { PropertyDetailed } from '@/lib/definitions';
import { PropertyImageGallery } from '@/features/properties/components/detail-page/PropertyImageGallery';
import { PropertyHighlights } from '@/features/properties/components/detail-page/PropertyHighlights';
import dynamic from 'next/dynamic';

const PropertyLocationMap = dynamic(
  () => import('@/features/properties/components/detail-page/PropertyLocationMap').then(mod => mod.PropertyLocationMap),
  { ssr: false, loading: () => <div className="h-64 w-full bg-gray-200 rounded-lg animate-pulse" /> }
);

const DetailSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="py-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
        {children}
    </div>
);

interface PropertyOwnerViewLayoutProps {
  property: PropertyDetailed;
}

export const PropertyOwnerViewLayout = ({ property }: PropertyOwnerViewLayoutProps) => {

  const formatPrice = (priceVal: number | null) => {
      if (!priceVal) return 'Price on request';
      return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
      }).format(priceVal);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column for main content */}
        <div className="lg:col-span-3">
          <PropertyImageGallery images={property.images} title={property.title} />

          <div className="mt-6">
            <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
            <p className="text-md text-gray-500 mt-1">{property.address}</p>
          </div>

          <PropertyHighlights
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            area={property.sizeSqft}
          />
          
          <DetailSection title="Description">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{property.description}</p>
          </DetailSection>

          {property.amenities?.length > 0 && (
            <DetailSection title="Amenities">
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm">
                {property.amenities.map(amenity => (
                  <li key={amenity.id} className="flex items-center text-gray-700">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    {amenity.name}
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}
        </div>

        {/* Right Column for metadata and map */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Overview</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold text-gray-800">{formatPrice(property.rentalPrice)} {property.paymentPeriod ? `/ ${property.paymentPeriod.toLowerCase()}` : ''}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Listing Type:</span>
                <span className="font-semibold text-gray-800">{property.listingType}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Property Type:</span>
                <span className="font-semibold text-gray-800">{property.propertyType}</span>
              </li>
               <li className="flex justify-between">
                <span className="text-gray-600">Furnishing:</span>
                <span className="font-semibold text-gray-800">{property.furnishingStatus.replace(/_/g, ' ')}</span>
              </li>
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
             {property.latitude && property.longitude ? (
                <PropertyLocationMap position={[property.latitude, property.longitude]} />
            ) : (
                <p className="text-gray-500 text-sm">Map location is not available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};