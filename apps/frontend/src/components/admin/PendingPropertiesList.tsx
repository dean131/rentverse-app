// File Path: apps/frontend/src/components/admin/PendingPropertiesList.tsx
'use client';

import { useState } from 'react';
import { PropertyWithLister } from '@/lib/definitions';
import { updatePropertyStatus } from '@/services/adminService';
import { Button } from '@/components/ui/Button';

interface PendingPropertiesListProps {
  initialProperties: PropertyWithLister[];
  onUpdate: (propertyId: number) => void;
}

export const PendingPropertiesList = ({ initialProperties, onUpdate }: PendingPropertiesListProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  const handleStatusUpdate = async (propertyId: number, status: 'APPROVED' | 'REJECTED') => {
    setLoadingStates(prev => ({ ...prev, [propertyId]: true }));
    setError(null);

    try {
      await updatePropertyStatus(propertyId, status);
      onUpdate(propertyId);
    } catch (err) {
      console.error(`Failed to update property ${propertyId} to ${status}`, err);
      setError(`Could not ${status.toLowerCase()} property. Please try again.`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [propertyId]: false }));
    }
  };
  
  if (initialProperties.length === 0) {
      return <p className="text-gray-500 text-center py-8">No pending properties found.</p>
  }

  return (
    <div className="overflow-x-auto">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listed By</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {initialProperties.map((property) => (
            <tr key={property.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{property.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{property.listedBy?.fullName}</div>
                <div className="text-sm text-gray-500">{property.listedBy?.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{property.propertyType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {property.rentalPrice ? `Rp ${property.rentalPrice.toLocaleString()}` : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                    <Button 
                        variant="outline" 
                        onClick={() => handleStatusUpdate(property.id, 'REJECTED')}
                        disabled={loadingStates[property.id]}
                        className="!px-3 !py-1 text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    >
                        Reject
                    </Button>
                    <Button 
                        onClick={() => handleStatusUpdate(property.id, 'APPROVED')}
                        disabled={loadingStates[property.id]}
                        className="!px-3 !py-1"
                    >
                        Approve
                    </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

