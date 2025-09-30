// File Path: apps/frontend/src/features/dashboard/components/AdminDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { getPendingProperties } from '@/features/admin/adminService';
import { PropertyWithLister } from '@/lib/definitions';
import { PendingPropertiesList } from '@/features/admin/components/PendingPropertiesList';
import { AdminStats } from './AdminStats';

export const AdminDashboard = () => {
  const [properties, setProperties] = useState<PropertyWithLister[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePropertyUpdate = (propertyId: number) => {
    setProperties(currentProperties => currentProperties.filter(p => p.id !== propertyId));
    // Note: For real-time updates, you might want to trigger a refetch of the stats here.
  };

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const data = await getPendingProperties();
        setProperties(data);
      } catch (err) {
        setError(`Could not load pending properties. \nError: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <AdminStats />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
           <h2 className="text-xl font-semibold mb-4 text-gray-800">Pending Approvals</h2>
           {isLoading ? <p>Loading properties...</p> : <PendingPropertiesList initialProperties={properties} onUpdate={handlePropertyUpdate} />}
      </div>
    </div>
  );
};