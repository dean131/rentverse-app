'use client';

import { PropertyPublic } from '@/lib/definitions';
import { useState, useEffect } from 'react';

interface Props {
    property: Pick<PropertyPublic, 'title' | 'address' | 'rentalPrice' | 'paymentPeriod'>;
}

export const PropertyCardInfo = ({ property }: Props) => {
    const [formattedPrice, setFormattedPrice] = useState<string>('N/A');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (property.rentalPrice) {
            const price = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(property.rentalPrice);
            setFormattedPrice(price);
        }
    }, [property.rentalPrice]);

    return (
        <div className="p-5">
            <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors">{property.title}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{property.address || 'Location not available'}</span>
            </div>
            <p className="text-xl font-bold text-gray-900 my-3">
                {isClient ? formattedPrice : 'Loading...'}
                {isClient && property.paymentPeriod && <span className="text-sm font-normal text-gray-500"> / {property.paymentPeriod.toLowerCase()}</span>}
            </p>
        </div>
    );
};
