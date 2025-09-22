// File Path: apps/frontend/src/components/dashboard/OwnerDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import { Button } from '@/components/ui/Button';
import { getUserDashboardStats } from '@/services/userService';
import { getOwnerProperties } from '@/services/propertyService'; // Import the new service
import { OwnerDashboardStats, OwnerProperty } from '@/lib/definitions';
import { OwnerPropertyList } from './OwnerPropertyList'; // Import the new component

export const OwnerDashboard = () => {
  const [stats, setStats] = useState<OwnerDashboardStats | null>(null);
  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats and properties in parallel for better performance
        const [statsData, propertiesData] = await Promise.all([
            getUserDashboardStats(),
            getOwnerProperties()
        ]);
        setStats(statsData);
        setProperties(propertiesData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load your dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderStatCards = () => {
    if (isLoading) {
      return Array(4).fill(0).map((_, index) => (
        <StatCard key={index} title="..." value="..." />
      ));
    }
    if (!stats) { // No need to check for error here, it's handled below
        return null;
    }
    return (
      <>
        <StatCard title="Total Listings" value={stats.totalListings} />
        <StatCard title="Approved" value={stats.approved} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Rejected" value={stats.rejected} />
      </>
    );
  };

  return (
    <>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">My Properties</h1>
            <Link href="/properties/submit">
                <Button>List New Property</Button>
            </Link>
        </div>
        
        {error ? (
             <div className="col-span-4 text-red-500 bg-red-50 p-4 rounded-md">{error}</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {renderStatCards()}
            </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow">
             <h2 className="text-xl font-semibold mb-4 text-gray-800">My Listings Overview</h2>
             {isLoading ? (
                <p>Loading your properties...</p>
             ) : (
                <OwnerPropertyList properties={properties} />
             )}
        </div>
    </>
  );
};

