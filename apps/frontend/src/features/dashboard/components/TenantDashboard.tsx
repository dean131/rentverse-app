// File Path: apps/frontend/src/features/dashboard/components/TenantDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { getMyAgreements } from '@/features/agreements/agreementService';
import { AgreementDetails } from '@/lib/definitions';
import { AgreementList } from '@/features/agreements/components/AgreementList';

export const TenantDashboard = () => {
  const [agreements, setAgreements] = useState<AgreementDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgreements = async () => {
    setIsLoading(true);
    try {
      const data = await getMyAgreements();
      setAgreements(data);
    } catch (err) {
      setError('Could not load your agreements. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  return (
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800">My Tenancy Agreements</h1>
        <p className="mt-2 text-gray-600 mb-6">
          Here you can view the status of your rental agreements and sign any pending documents.
        </p>
        
        {error && <div className="text-red-500 bg-red-50 p-4 rounded-md mb-6">{error}</div>}

        {isLoading ? (
          <p>Loading your agreements...</p>
        ) : (
          <AgreementList agreements={agreements} onUpdate={fetchAgreements} />
        )}
      </div>
  );
};