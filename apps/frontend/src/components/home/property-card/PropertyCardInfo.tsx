// File Path: apps/frontend/src/components/home/property-card/PropertyCardInfo.tsx
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
            <h3 className="text-lg font-bold text-gray-900 truncate">{property.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{property.address || 'Location not available'}</p>
            <p className="text-xl font-bold text-orange-700 my-3 h-8">
                {isClient ? formattedPrice : 'Loading price...'}
                {isClient && property.paymentPeriod && <span className="text-sm font-normal text-gray-500">/{property.paymentPeriod.toLowerCase()}</span>}
            </p>
        </div>
    );
};
