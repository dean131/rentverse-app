// File Path: apps/frontend/src/components/home/property-card/PropertyCardStats.tsx
import { PropertyPublic } from '@/lib/definitions';

interface Props {
  property: Pick<PropertyPublic, 'bedrooms' | 'bathrooms' | 'sizeSqft'>;
}

const StatIcon = ({ d, value, label }: { d: string; value: string | number; label: string }) => (
    <div className="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={d} />
        </svg>
        <div>
            <p className="font-semibold text-sm text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    </div>
);

export const PropertyCardStats = ({ property }: Props) => {
  return (
    <div className="px-5 pb-5">
        <div className="flex justify-between items-center pt-3 border-t">
            <StatIcon d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-4a2 2 0 012-2h6a2 2 0 012 2v4" value={property.bedrooms} label="Bedrooms" />
            <StatIcon d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" value={property.bathrooms} label="Bathrooms" />
            <StatIcon d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v4m0 0h-4m4 0l-5-5" value={`${property.sizeSqft} Sqft`} label="Total Area" />
        </div>
    </div>
  );
};
