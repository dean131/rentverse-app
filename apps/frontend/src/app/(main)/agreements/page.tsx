// File Path: apps/frontend/src/app/(main)/agreements/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { getMyAgreements } from '@/services/agreementService';
import { AgreementDetails } from '@/lib/definitions';
import { AgreementList } from '@/components/agreements/AgreementList';

export default function MyAgreementsPage() {
  const [agreements, setAgreements] = useState<AgreementDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback to create a stable function reference for refetching
  const fetchAgreements = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMyAgreements();
      setAgreements(data);
    } catch (err) {
      console.error("Failed to fetch agreements:", err);
      setError("Could not load your agreements at this time.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgreements();
  }, [fetchAgreements]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Agreements</h1>
      {isLoading ? (
        <p>Loading your agreements...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <AgreementList agreements={agreements} onUpdate={fetchAgreements} />
      )}
    </div>
  );
}

