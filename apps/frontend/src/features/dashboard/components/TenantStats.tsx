// File Path: apps/frontend/src/features/dashboard/components/TenantStats.tsx
'use client';

import { useMemo } from 'react';
import { AgreementDetails } from '@/lib/definitions';
import { StatCard } from '@/features/admin/components/dashboard/StatCard';

interface TenantStatsProps {
  agreements: AgreementDetails[];
  isLoading: boolean;
}

export const TenantStats = ({ agreements, isLoading }: TenantStatsProps) => {
  const stats = useMemo(() => {
    return {
      total: agreements.length,
      pending: agreements.filter(a => a.status === 'PENDING_OWNER_APPROVAL' || a.status === 'PENDING_SIGNATURES').length,
      active: agreements.filter(a => a.status === 'ACTIVE').length,
      rejected: agreements.filter(a => a.status === 'OWNER_REJECTED').length,
    };
  }, [agreements]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
      <StatCard title="Total Agreements" value={isLoading ? '...' : stats.total} />
      <StatCard title="Pending" value={isLoading ? '...' : stats.pending} />
      <StatCard title="Active" value={isLoading ? '...' : stats.active} />
      <StatCard title="Rejected" value={isLoading ? '...' : stats.rejected} />
    </div>
  );
};