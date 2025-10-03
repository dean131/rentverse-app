// File Path: frontend/src/features/dashboard/components/OwnerPropertyList.tsx
'use client';

import { useState, useMemo } from 'react';
import { OwnerProperty } from '@/lib/definitions';
import Image from 'next/image';
import { Pagination } from '@/ui/ui/Pagination';
import { Button } from '@/ui/ui/Button';
import { OwnerPropertyViewModal } from './OwnerPropertyViewModal';

interface OwnerPropertyListProps {
  properties: OwnerProperty[];
}

const ITEMS_PER_PAGE = 5;

const renderStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        APPROVED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800',
        RENTED: 'bg-blue-100 text-blue-800',
        SOLD: 'bg-purple-100 text-purple-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.toLowerCase()}
        </span>
    );
};

export const OwnerPropertyList = ({ properties }: OwnerPropertyListProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

    const paginatedProperties = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return properties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [properties, currentPage]);

    const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);

    if (properties.length === 0) {
        return <div className="p-6"><p className="text-gray-500 text-center py-10">You have not listed any properties yet.</p></div>
    }

    return (
        <>
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Listing</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Listed</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedProperties.map((property) => (
                            <tr key={property.id} className="hover:bg-gray-50 transition-colors">
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
                                     <Button variant="outline" size="sm" onClick={() => setSelectedPropertyId(property.id)}>
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {selectedPropertyId && (
                <OwnerPropertyViewModal
                    propertyId={selectedPropertyId}
                    onClose={() => setSelectedPropertyId(null)}
                />
            )}
        </>
    );
};