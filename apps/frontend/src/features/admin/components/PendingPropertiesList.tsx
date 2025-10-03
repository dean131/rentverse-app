// File Path: frontend/src/features/admin/components/PendingPropertiesList.tsx
'use client';

import { useState, useMemo } from 'react';
import { PropertyWithLister } from '@/lib/definitions';
import { Button } from '@/ui/ui/Button';
import { Pagination } from '@/ui/ui/Pagination';
import { PropertyReviewModal } from './PropertyReviewModal';

interface PendingPropertiesListProps {
  initialProperties: PropertyWithLister[];
  onUpdate: (propertyId: number) => void;
}

const ITEMS_PER_PAGE = 5;

export const PendingPropertiesList = ({ initialProperties, onUpdate }: PendingPropertiesListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return initialProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [initialProperties, currentPage]);

  const totalPages = Math.ceil(initialProperties.length / ITEMS_PER_PAGE);
  
  const handleReviewClick = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
  };

  const handleCloseModal = () => {
    setSelectedPropertyId(null);
  };

  const handleActionInModal = () => {
    if (selectedPropertyId) {
      onUpdate(selectedPropertyId);
    }
    handleCloseModal();
  };
  
  if (initialProperties.length === 0) {
      return <div className="p-6"><p className="text-gray-500 text-center py-8">No pending properties found.</p></div>
  }

  return (
    <>
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Listed By</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{property.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.listedBy?.fullName}</div>
                    <div className="text-sm text-gray-500">{property.listedBy?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{property.propertyType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {property.rentalPrice ? new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 0 }).format(property.rentalPrice) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="outline" size="sm" onClick={() => handleReviewClick(property.id)}>
                        Review
                    </Button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      
      {selectedPropertyId && (
        <PropertyReviewModal 
          propertyId={selectedPropertyId} 
          onClose={handleCloseModal}
          onActionComplete={handleActionInModal}
        />
      )}
    </>
  );
};