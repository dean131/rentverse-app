// File Path: apps/frontend/src/components/admin/PendingPropertiesList.tsx
'use client';

import { useState } from 'react';
import { PropertyWithLister } from '@/lib/definitions';
import { updatePropertyStatus } from '@/services/adminService';

interface PendingPropertiesListProps {
  initialProperties: PropertyWithLister[];
}

// Reusable Action Button
const ActionButton = ({ onClick, disabled, children, className }: { onClick: () => void; disabled: boolean; children: React.ReactNode; className: string; }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 text-xs font-semibold text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);


export const PendingPropertiesList = ({ initialProperties }: PendingPropertiesListProps) => {
  const [properties, setProperties] = useState<PropertyWithLister[]>(initialProperties);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    setLoadingId(id);
    setError(null);
    try {
      await updatePropertyStatus(id, status);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(`Failed to ${status.toLowerCase()} property:`, err);
      setError(`Could not update property status. Please try again.`);
    } finally {
      setLoadingId(null);
    }
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">All Clear!</h3>
        <p className="mt-1 text-sm text-gray-500">There are no pending properties to review.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
        {error && <p className="pb-4 text-sm text-center text-red-600">{error}</p>}
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listed By</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                {property.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-3">
                                <ActionButton
                                    onClick={() => handleUpdateStatus(property.id, 'APPROVED')}
                                    disabled={loadingId === property.id}
                                    className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                >
                                    {loadingId === property.id ? '...' : 'Approve'}
                                </ActionButton>
                                <ActionButton
                                    onClick={() => handleUpdateStatus(property.id, 'REJECTED')}
                                    disabled={loadingId === property.id}
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                >
                                    {loadingId === property.id ? '...' : 'Reject'}
                                </ActionButton>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};

