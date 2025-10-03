import { PropertyPublic } from '@/lib/definitions';

interface Props {
  property: Pick<PropertyPublic, 'bedrooms' | 'bathrooms' | 'sizeSqft'>;
}

const StatIcon = ({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) => (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
        {icon}
        <span>{value} {label}</span>
    </div>
);

export const PropertyCardStats = ({ property }: Props) => {
  return (
    <div className="px-5 pb-5 border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center text-sm">
            <StatIcon 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>}
              value={property.bedrooms} 
              label="Beds" 
            />
            <StatIcon 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
              value={property.bathrooms} 
              label="Baths" 
            />
            <StatIcon 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v4m0 0h-4m4 0l-5-5" /></svg>}
              value={`${property.sizeSqft}`}
              label="Sqft" 
            />
        </div>
    </div>
  );
};