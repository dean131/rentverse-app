// File Path: apps/frontend/src/components/dashboard/OwnerPropertyList.tsx
'use client';

import { OwnerProperty } from '@/lib/definitions';
import Image from 'next/image';
import Link from 'next/link';

interface OwnerPropertyListProps {
  properties: OwnerProperty[];
}

const renderStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        APPROVED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.toLowerCase()}
        </span>
    );
};

export const OwnerPropertyList = ({ properties }: OwnerPropertyListProps) => {
    if (properties.length === 0) {
        return <p className="text-gray-500 text-center py-10">You have not listed any properties yet.</p>
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Listed</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {properties.map((property) => (
                        <tr key={property.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <Image className="h-10 w-10 rounded-md object-cover" src={property.images[0]?.imageUrl || 'https://placehold.co/100x100'} alt="" width={40} height={40} />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{property.title}</div>
                                        <div className="text-sm text-gray-500">{property.propertyType}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(property.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{renderStatusBadge(property.status)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={`/properties/${property.id}`} className="text-orange-600 hover:text-orange-900">
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
