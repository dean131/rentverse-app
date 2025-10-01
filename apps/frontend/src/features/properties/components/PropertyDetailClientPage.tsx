// File Path: apps/frontend/src/components/properties/PropertyDetailClientPage.tsx
'use client'; 

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PropertyDetailed } from '@/lib/definitions';
import { PropertyImageGallery } from './detail-page/PropertyImageGallery';
import { PropertyHeader } from './detail-page/PropertyHeader';
import { PropertyHighlights } from './detail-page/PropertyHighlights';
import { BookingModal } from './detail-page/BookingModal';
import { useAuth } from '@/features/auth/useAuth';
import Image from 'next/image';
import { Button } from '@/ui/ui/Button';

// Dynamically import the map component to avoid SSR issues with Leaflet
const PropertyLocationMap = dynamic(
  () => import('./detail-page/PropertyLocationMap').then(mod => mod.PropertyLocationMap),
  { 
    ssr: false,
    loading: () => <div className="h-96 w-full bg-gray-200 rounded-lg animate-pulse flex items-center justify-center"><p>Loading map...</p></div>
  }
);

// A reusable component for rendering a section with a title
const DetailSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="py-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        {children}
    </div>
);

export const PropertyDetailClientPage = ({ property }: { property: PropertyDetailed }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { user } = useAuth();

  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false);
    alert("Success! Your booking request has been sent to the property owner for approval.");
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertyImageGallery images={property.images} title={property.title} />

        {/* All content is now in a single, centered, vertical column */}
        <div className="mt-8 max-w-4xl mx-auto">
            <PropertyHeader 
              title={property.title}
              address={property.address}
              price={property.rentalPrice}
              period={property.paymentPeriod}
              onRequestBooking={() => user && user.role === 'TENANT' ? setIsBookingModalOpen(true) : alert("Please log in as a tenant to book a property.")}
            />
            <PropertyHighlights 
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.sizeSqft}
            />
            
            <DetailSection title="About this property">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{property.description}</p>
            </DetailSection>

            {property.amenities && property.amenities.length > 0 && (
                <DetailSection title="Features & Amenities">
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
                        {property.amenities.map(amenity => (
                            <li key={amenity.id} className="flex items-center text-gray-700">
                                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                {amenity.name}
                            </li>
                        ))}
                    </ul>
                </DetailSection>
            )}

            {property.listedBy && (
              <DetailSection title="Listed By">
                <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center space-y-4">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={property.listedBy.profilePictureUrl || 'https://placehold.co/100x100/CCCCCC/FFFFFF/png?text=User'}
                        alt={`Profile picture of ${property.listedBy.fullName}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{property.listedBy.fullName}</p>
                      <p className="text-md text-gray-500">Property Owner</p>
                      <p className="text-md text-gray-500">{property.listedBy.email}</p>
                    </div>
                    <div className="w-full sm:w-auto">
                        <Button className="w-full">Contact Agent</Button>
                    </div>
                </div>
              </DetailSection>
            )}

            <DetailSection title="Location">
                <p className="text-gray-600 mb-4">{property.address}</p>
                {property.latitude && property.longitude ? (
                    <PropertyLocationMap position={[property.latitude, property.longitude]} />
                ) : (
                    <p className="text-gray-500">Map location is not available for this property.</p>
                )}
            </DetailSection>
        </div>
      </div>

      {isBookingModalOpen && (
        <BookingModal 
          propertyId={property.id} 
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

