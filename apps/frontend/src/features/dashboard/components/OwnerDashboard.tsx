// File Path: apps/frontend/src/features/dashboard/components/OwnerDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/ui/ui/Button';
import { getUserDashboardStats } from '@/features/users/userService';
import { getOwnerProperties } from '@/features/properties/propertyService';
import { getMyAgreements } from '@/features/agreements/agreementService';
import { OwnerDashboardStats, OwnerProperty, AgreementDetails } from '@/lib/definitions';
import { OwnerPropertyList } from './OwnerPropertyList';
import { AgreementList } from '@/features/agreements/components/AgreementList';
import { OwnerStats } from './OwnerStats';

export const OwnerDashboard = () => {
  const [stats, setStats] = useState<OwnerDashboardStats | null>(null);
  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const [agreements, setAgreements] = useState<AgreementDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, propertiesData, agreementsData] = await Promise.all([
          getUserDashboardStats(),
          getOwnerProperties(),
          getMyAgreements(),
      ]);
      setStats(statsData);
      setProperties(propertiesData);
      setAgreements(agreementsData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Could not load your dashboard data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
                <Link href="/properties/submit">
                    <Button>List New Property</Button>
                </Link>
            </div>
            {error && <div className="text-red-500 bg-red-50 p-4 rounded-md mb-6">{error}</div>}
            <OwnerStats stats={stats} isLoading={isLoading} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
             <h2 className="text-xl font-semibold mb-4 text-gray-800">My Listings Overview</h2>
             {isLoading ? (
                <p>Loading your properties...</p>
             ) : (
                <OwnerPropertyList properties={properties} />
             )}
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Rental Agreements</h2>
            {isLoading ? (
            <p>Loading your agreements...</p>
            ) : (
            <AgreementList agreements={agreements} onUpdate={fetchData} />
            )}
        </div>
    </div>
  );
};