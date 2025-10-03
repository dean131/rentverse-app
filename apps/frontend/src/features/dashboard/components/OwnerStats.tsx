// File Path: apps/frontend/src/features/dashboard/components/OwnerStats.tsx
'use client';

import { OwnerDashboardStats } from '@/lib/definitions';
import { StatCard } from '@/features/admin/components/dashboard/StatCard';

interface OwnerStatsProps {
  stats: OwnerDashboardStats | null;
  isLoading: boolean;
}

export const OwnerStats = ({ stats, isLoading }: OwnerStatsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        {Array(4).fill(0).map((_, index) => (
          <StatCard key={index} title="..." value="..." />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
      <StatCard title="Total Listings" value={stats.totalListings} />
      <StatCard title="Approved" value={stats.approved} />
      <StatCard title="Pending" value={stats.pending} />
      <StatCard title="Rejected" value={stats.rejected} />
    </div>
  );
};