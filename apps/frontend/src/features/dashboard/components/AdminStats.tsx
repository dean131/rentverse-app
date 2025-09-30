// File Path: apps/frontend/src/features/dashboard/components/AdminStats.tsx
'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/features/admin/components/dashboard/StatCard';
import { getAdminDashboardStats } from '@/features/admin/adminService';
import { AdminDashboardStats as AdminStatsData } from '@/lib/definitions';

export const AdminStats = () => {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
      <StatCard title="Total Documents" value={isLoading ? '...' : stats?.totalDocuments ?? 'N/A'} />
      <StatCard title="Registered Users" value={isLoading ? '...' : stats?.registeredUsers ?? 'N/A'} />
      <StatCard title="Pending Properties" value={isLoading ? '...' : stats?.pendingProperties ?? 'N/A'} />
      <StatCard title="Approved This Month" value={isLoading ? '...' : stats?.documentsThisMonth ?? 'N/A'} />
    </div>
  );
};