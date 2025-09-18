// File Path: apps/frontend/src/components/admin/PendingPropertiesList.tsx
'use client';

import { useState } from 'react';
import { PropertyWithLister } from '@/lib/definitions';
import { updatePropertyStatus } from '@/services/adminService';

interface Props {
  initialProperties: PropertyWithLister[];
  onUpdate: (propertyId: number) => void; // Callback to notify parent of an update
}

export const PendingPropertiesList = ({ initialProperties, onUpdate }: Props) => {
  const [properties, setProperties] = useState<PropertyWithLister[]>(initialProperties);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleStatusUpdate = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    setUpdatingId(id);
    setError(null);
    try {
      await updatePropertyStatus(id, status);
      // Notify parent component to update its list
      onUpdate(id);
      // Also update local state for immediate feedback
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(`Failed to ${status.toLowerCase()} property:`, err);
      setError(`Could not update property #${id}. Please try again.`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (properties.length === 0) {
    return <p className="text-center text-gray-500 py-8">No pending properties to review.</p>;
  }

  return (
    <div className="overflow-x-auto">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Title</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listed By</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (Rp)</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {properties.map((property) => (
            <tr key={property.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{property.title}</div>
                <div className="text-sm text-gray-500">{property.propertyType}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{property.listedBy.fullName}</div>
                <div className="text-sm text-gray-500">{property.listedBy.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {property.rentalPrice?.toLocaleString('id-ID') || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                   <button
                    onClick={() => handleStatusUpdate(property.id, 'APPROVED')}
                    disabled={updatingId === property.id}
                    className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-md hover:bg-green-50 transition-colors"
                  >
                    {updatingId === property.id ? '...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(property.id, 'REJECTED')}
                    disabled={updatingId === property.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                  >
                    {updatingId === property.id ? '...' : 'Reject'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

