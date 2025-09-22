// File Path: apps/frontend/src/components/properties/PropertyDetailClientPage.tsx
'use client'; 

import { useState } from 'react';
import { PropertyDetailed } from '@/lib/definitions';
import { PropertyImageGallery } from './detail-page/PropertyImageGallery';
import { PropertyHeader } from './detail-page/PropertyHeader';
import { PropertyHighlights } from './detail-page/PropertyHighlights';
import { AgentCard } from './detail-page/AgentCard';
import { PropertyInfoTabs } from './detail-page/PropertyInfoTabs';
import { BookingModal } from './detail-page/BookingModal'; // Import the new modal
import { useAuth } from '@/hooks/useAuth';

export const PropertyDetailClientPage = ({ property }: { property: PropertyDetailed }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { user } = useAuth();

  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false);
    // In a real app, you might show a more elegant success message (e.g., a toast notification)
    alert("Success! Your booking request has been sent to the property owner for approval.");
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertyImageGallery images={property.images} title={property.title} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyHeader 
              title={property.title}
              address={property.address}
              price={property.rentalPrice}
              period={property.paymentPeriod}
              // Only allow booking if the user is a tenant
              onRequestBooking={() => user && user.role === 'TENANT' ? setIsBookingModalOpen(true) : alert("Please log in as a tenant to book a property.")}
            />
            <PropertyHighlights 
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.sizeSqft}
            />
            <PropertyInfoTabs 
              description={property.description}
              amenities={property.amenities}
            />
          </div>

          <div className="lg:col-span-1">
            {property.listedBy && <AgentCard agent={property.listedBy} />}
          </div>
        </div>
      </div>

      {/* Conditionally render the booking modal */}
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

