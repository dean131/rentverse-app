// File Path: apps/frontend/src/app/(main)/dashboard/page.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Import the new role-specific dashboard components
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { OwnerDashboard } from '@/components/dashboard/OwnerDashboard';
import { TenantDashboard } from '@/components/dashboard/TenantDashboard';

// This page now acts as a "router" to display the correct dashboard
// based on the user's role.
export default function UnifiedDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the auth check is done and there's no user, redirect to login
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading Dashboard...</div>;
  }

  // Conditionally render the correct dashboard component based on the user's role
  switch (user?.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'PROPERTY_OWNER':
      return <OwnerDashboard />;
    case 'TENANT':
      return <TenantDashboard />;
    default:
      // This will show while loading or if the user is not found before redirecting.
      return <div className="flex h-screen items-center justify-center">Authenticating...</div>;
  }
}

