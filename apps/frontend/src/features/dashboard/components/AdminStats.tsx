// File Path: apps/frontend/src/features/dashboard/components/AdminStats.tsx
'use client';

import { StatCard } from '@/features/admin/components/dashboard/StatCard';
import { PropertyWithLister } from '@/lib/definitions';

interface AdminStatsProps {
  properties: PropertyWithLister[];
  isLoading: boolean;
}

export const AdminStats = ({ properties, isLoading }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Documents" value="N/A" />
        <StatCard title="Registered Users" value="N/A" />
        <StatCard title="Pending Properties" value={isLoading ? '...' : properties.length} />
        <StatCard title="Approved This Month" value="N/A" />
    </div>
  );
};