// File Path: frontend/src/features/properties/components/detail-page/PropertyHeader.tsx
'use client';

import { Button } from '@/ui/ui/Button';

interface HeaderProps {
    title: string;
    address: string;
    price: number | null;
    period: string | null;
    listingType: "RENT" | "SALE" | "BOTH";
    onRequestBooking: () => void;
    onMakeInquiry: () => void;
}

export const PropertyHeader = ({ title, address, price, period, listingType, onRequestBooking, onMakeInquiry }: HeaderProps) => {
    const formatPrice = (priceVal: number | null) => {
        if (!priceVal) return 'Price on request';
        return new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: 'MYR',
            minimumFractionDigits: 0,
        }).format(priceVal);
    };

    const isForRent = listingType === 'RENT' || listingType === 'BOTH';
    const isForSale = listingType === 'SALE' || listingType === 'BOTH';

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-md text-gray-500 mt-1">{address}</p>
            <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
                <p className="text-2xl font-bold text-orange-400">
                    {formatPrice(price)}
                    {isForRent && period && <span className="text-sm font-normal text-gray-500">/{period.toLowerCase()}</span>}
                </p>
                <div className="flex space-x-2">
                    {isForSale && <Button onClick={onMakeInquiry}>Make an Inquiry</Button>}
                    {isForRent && <Button onClick={onRequestBooking}>Request to Book</Button>}
                </div>
            </div>
        </div>
    );
};