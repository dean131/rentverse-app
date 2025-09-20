// File Path: apps/frontend/src/components/dashboard/TenantDashboard.tsx
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout'; // CORRECTED IMPORT

export const TenantDashboard = () => {
  return (
    <DashboardLayout>
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to your Dashboard</h1>
        <p className="mt-2 text-gray-600">Here you will find your saved properties, recent searches, and account settings.</p>
      </div>
    </DashboardLayout>
  );
};

