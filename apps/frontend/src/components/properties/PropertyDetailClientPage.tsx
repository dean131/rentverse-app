// File Path: apps/frontend/src/components/properties/PropertyDetailClientPage.tsx
'use client'; 

import { PropertyDetailed } from '@/lib/definitions';
import { PropertyImageGallery } from './detail-page/PropertyImageGallery';
import { PropertyHeader } from './detail-page/PropertyHeader';
import { PropertyHighlights } from './detail-page/PropertyHighlights';
import { AgentCard } from './detail-page/AgentCard';
import { PropertyInfoTabs } from './detail-page/PropertyInfoTabs';
import { Footer } from '@/components/home/Footer';

export const PropertyDetailClientPage = ({ property }: { property: PropertyDetailed }) => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery Section */}
        <PropertyImageGallery images={property.images} title={property.title} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            <PropertyHeader 
              title={property.title}
              address={property.address}
              price={property.rentalPrice}
              period={property.paymentPeriod}
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

          {/* Sidebar Column */}
          <div className="lg:col-span-1">
            <AgentCard agent={property.listedBy} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

