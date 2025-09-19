// File Path: apps/frontend/src/components/properties/detail-page/PropertyHeader.tsx
import { Button } from '@/components/ui/Button';

interface HeaderProps {
    title: string;
    address: string;
    price: number | null;
    period: string | null;
}

export const PropertyHeader = ({ title, address, price, period }: HeaderProps) => {
    const formatPrice = (price: number | null) => {
        if (!price) return 'Price on request';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-md text-gray-500 mt-1">{address}</p>
            <div className="flex justify-between items-center mt-4">
                <p className="text-2xl font-bold text-orange-600">
                    {formatPrice(price)}
                    {period && <span className="text-sm font-normal text-gray-500">/{period.toLowerCase()}</span>}
                </p>
                <div className="flex space-x-2">
                    <Button variant="outline">Save</Button>
                    <Button>Request a tour</Button>
                </div>
            </div>
        </div>
    );
};
