// File Path: apps/frontend/src/components/home/PropertyCard.tsx
import Image from 'next/image';
import { PropertyWithLister } from '@/lib/definitions'; // Using our new, more specific type

interface PropertyCardProps {
    property: PropertyWithLister & { imageUrl?: string };
}

export const PropertyCard = ({ property }: PropertyCardProps) => {

    const formatPrice = (price: number | null) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden text-left transform hover:-translate-y-2 transition-transform duration-300">
            <div className="relative h-56">
                <Image
                    src={property.imageUrl || 'https://placehold.co/600x400/orange/white?text=Rentverse'}
                    alt={`Image of ${property.title}`}
                    layout="fill"
                    objectFit="cover"
                />
                <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    For Rent
                </span>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                <p className="text-lg font-semibold text-orange-400 mb-4">{formatPrice(property.rentalPrice)} /mo</p>
                <div className="flex justify-between text-sm text-gray-600 border-t pt-4">
                    <div className="flex items-center">
                        {/* Bedrooms Icon */}
                        <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                        <span>{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center">
                         {/* Bathrooms Icon */}
                        <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h2" /></svg>
                        <span>{property.bathrooms} Bathrooms</span>
                    </div>
                     <div className="flex items-center">
                         {/* Area Icon */}
                        <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>
                        <span>{property.sizeSqft} sqft</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
