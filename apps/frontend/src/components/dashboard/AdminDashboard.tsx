// File Path: apps/frontend/src/components/dashboard/AdminDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { getPendingProperties } from '@/services/adminService';
import { PropertyWithLister } from '@/lib/definitions';
import { PendingPropertiesList } from '@/components/admin/PendingPropertiesList';
import { DashboardLayout } from '@/components/layout/DashboardLayout'; // CORRECTED IMPORT
import { StatCard } from '@/components/admin/dashboard/StatCard';

export const AdminDashboard = () => {
  const [properties, setProperties] = useState<PropertyWithLister[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePropertyUpdate = (propertyId: number) => {
    setProperties(currentProperties => currentProperties.filter(p => p.id !== propertyId));
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getPendingProperties();
        setProperties(data);
      } catch (err) {
        setError("Could not load pending properties.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (error) {
    return <DashboardLayout><div className="text-red-500 p-8">{error}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Documents" value="N/A" />
            <StatCard title="Registered Users" value="N/A" />
            <StatCard title="Pending Properties" value={isLoading ? '...' : properties.length} />
            <StatCard title="Approved This Month" value="N/A" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
             <h2 className="text-xl font-semibold mb-4 text-gray-800">Pending Approvals</h2>
             {isLoading ? <p>Loading properties...</p> : <PendingPropertiesList initialProperties={properties} onUpdate={handlePropertyUpdate} />}
        </div>
    </DashboardLayout>
  );
};

