// File Path: apps/frontend/src/app/(main)/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getPendingProperties } from '@/services/adminService';
import { PropertyWithLister } from '@/lib/definitions';
import { PendingPropertiesList } from '@/components/admin/PendingPropertiesList';
import { AdminLayout } from '@/components/admin/DashboardLayout';
import { StatCard } from '@/components/admin/dashboard/StatCard';


export default function AdminDashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyWithLister[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePropertyUpdate = (propertyId: number) => {
    // This function is called by the child component when an update is successful.
    // It filters out the updated property from the state, causing the UI to re-render.
    setProperties(currentProperties => currentProperties.filter(p => p.id !== propertyId));
  };

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'ADMIN') {
        setError("Access Denied: You do not have permission to view this page.");
        setIsLoading(false);
        return;
    }

    const fetchProperties = async () => {
      try {
        const data = await getPendingProperties();
        setProperties(data);
      } catch (err) {
        console.error("Failed to fetch pending properties:", err);
        setError("Could not load properties. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [user, isAuthLoading, router]);
  
  if (isAuthLoading || isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading Admin Dashboard...</div>;
  }
  
  if (error) {
      return <div className="flex h-screen items-center justify-center text-red-600">{error}</div>
  }

  return (
    <AdminLayout>
        {/* Stat Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Documents" value={150} />
            <StatCard title="Registered User" value={150} />
            <StatCard title="Pending" value={properties.length} />
            <StatCard title="this month's document" value={12} />
        </div>

        {/* Pending Properties Table Section */}
        <div className="bg-white p-6 rounded-lg shadow">
             <h2 className="text-xl font-semibold mb-4 text-gray-800">Pending Approvals</h2>
             <PendingPropertiesList initialProperties={properties} onUpdate={handlePropertyUpdate} />
        </div>
    </AdminLayout>
  );
}

