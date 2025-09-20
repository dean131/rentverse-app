// File Path: apps/frontend/src/components/dashboard/OwnerDashboard.tsx
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout'; // CORRECTED IMPORT
import { StatCard } from '@/components/admin/dashboard/StatCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const OwnerDashboard = () => {
  const stats = {
    totalListings: 5,
    pending: 1,
    approved: 4,
    rejected: 0,
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
            <StatCard title="Total Listings" value={stats.totalListings} />
            <StatCard title="Approved Listings" value={stats.approved} />
            <StatCard title="Pending Approval" value={stats.pending} />
            <StatCard title="Rejected Listings" value={stats.rejected} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
             <h2 className="text-xl font-semibold mb-4 text-gray-800">My Listings Overview</h2>
             <p>A table of your properties will be displayed here.</p>
        </div>
    </DashboardLayout>
  );
};

