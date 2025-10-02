// Create a new file at: frontend/src/features/dashboard/components/OwnerPropertyViewModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { getPropertyById } from '@/features/properties/propertyService';
import { PropertyDetailed } from '@/lib/definitions';
import { PropertyOwnerViewLayout } from './PropertyOwnerViewLayout';

interface OwnerPropertyViewModalProps {
  propertyId: number;
  onClose: () => void;
}

export const OwnerPropertyViewModal = ({ propertyId, onClose }: OwnerPropertyViewModalProps) => {
  const [property, setProperty] = useState<PropertyDetailed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) return;

    const fetchProperty = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPropertyById(propertyId);
        setProperty(data);
      } catch (err) {
        console.error("Failed to fetch property details:", err);
        setError("Could not load property details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full h-[90vh] relative flex flex-col">
        <div className="flex-shrink-0 p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 truncate pr-4">Property Details: {property?.title || '...'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading && <div className="p-8 text-center">Loading details...</div>}
          {error && <div className="p-8 text-center text-red-500">{error}</div>}
          {property && <PropertyOwnerViewLayout property={property} />}
        </div>
      </div>
       <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-fast { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};