// File Path: apps/frontend/src/components/properties/detail-page/PropertyHighlights.tsx
import { ReactNode } from 'react';

const HighlightItem = ({ icon, value, label }: { icon: ReactNode; value: string | number; label: string }) => (
    <div className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg">
        <div className="text-orange-600">{icon}</div>
        <div>
            <p className="font-semibold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

export const PropertyHighlights = ({ bedrooms, bathrooms, area }: { bedrooms: number; bathrooms: number; area: number; }) => {
    return (
        <div className="my-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <HighlightItem 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-4a2 2 0 012-2h6a2 2 0 012 2v4" /></svg>}
                value={bedrooms}
                label="Bedrooms"
            />
            <HighlightItem 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                value={bathrooms}
                label="Bathrooms"
            />
            <HighlightItem 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v4m0 0h-4m4 0l-5-5" /></svg>}
                value={`${area} Sqft`}
                label="Total Area"
            />
        </div>
    );
};

