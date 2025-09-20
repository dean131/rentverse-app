// File Path: apps/frontend/src/components/dashboard/OwnerDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import { Button } from '@/components/ui/Button';
import { getUserDashboardStats } from '@/services/userService'; // Import the new service
import { OwnerDashboardStats } from '@/lib/definitions';

export const OwnerDashboard = () => {
  const [stats, setStats] = useState<OwnerDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError("Could not load your dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const renderStatCards = () => {
    if (isLoading) {
      return Array(4).fill(0).map((_, index) => (
        <StatCard key={index} title="..." value="..." />
      ));
    }
    if (error || !stats) {
      return <div className="col-span-4 text-red-500">{error || "Data not available."}</div>;
    }
    return (
      <>
        <StatCard title="Total Listings" value={stats.totalListings} />
        <StatCard title="Approved Listings" value={stats.approved} />
        <StatCard title="Pending Approval" value={stats.pending} />
        <StatCard title="Rejected Listings" value={stats.rejected} />
      </>
    );
  };

  return (
    <DashboardLayout>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">My Properties</h1>
            <Link href="/properties/submit">
                <Button>List New Property</Button>
            </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {renderStatCards()}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
             <h2 className="text-xl font-semibold mb-4 text-gray-800">My Listings Overview</h2>
             {/* A table of the owner's properties will be rendered here in a future step */}
             <p className="text-gray-500">A detailed list of your properties and their statuses will appear here soon.</p>
        </div>
    </DashboardLayout>
  );
};

