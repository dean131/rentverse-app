// File Path: apps/frontend/src/components/properties/PropertyDetailClientPage.tsx
'use client'; 

import { PropertyDetailed } from '@/lib/definitions';
import Image from 'next/image';

// This component's only job is to display the data it receives.
export const PropertyDetailClientPage = ({ property }: { property: PropertyDetailed }) => {
  return (
    <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-2 text-gray-900">{property.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{property.address}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {property.images.map(img => (
                    <div key={img.imageUrl} className="relative h-96 w-full">
                        <Image 
                            src={img.imageUrl} 
                            alt={`View of ${property.title}`} 
                            layout="fill" 
                            objectFit="cover" 
                            className="rounded-lg" 
                        />
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Description</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
                    
                    <h2 className="text-2xl font-semibold border-b pb-2 mt-8 mb-4">Amenities</h2>
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
                        {property.amenities.map(amenity => (
                            <li key={amenity.id} className="flex items-center text-gray-700">
                                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                {amenity.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg self-start sticky top-24">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-3">Property Details</h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between"><span>Price:</span> <span className="font-semibold">{property.rentalPrice ? `Rp ${property.rentalPrice.toLocaleString()}/${property.paymentPeriod?.toLowerCase()}` : 'N/A'}</span></div>
                        <div className="flex justify-between"><span>Bedrooms:</span> <span className="font-semibold">{property.bedrooms}</span></div>
                        <div className="flex justify-between"><span>Bathrooms:</span> <span className="font-semibold">{property.bathrooms}</span></div>
                        <div className="flex justify-between"><span>Size:</span> <span className="font-semibold">{property.sizeSqft} sqft</span></div>
                        <div className="flex justify-between"><span>Furnishing:</span> <span className="font-semibold">{property.furnishingStatus.replace('_', ' ')}</span></div>
                        <div className="flex justify-between"><span>Views:</span> <span className="font-semibold text-right">{property.views.map(v => v.name).join(', ')}</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

