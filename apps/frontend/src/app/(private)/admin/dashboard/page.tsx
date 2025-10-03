// File Path: apps/frontend/src/app/(main)/dashboard/page.tsx
'use client';

import { useAuth } from '@/features/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Import the new role-specific dashboard components
import { AdminDashboard } from '@/features/dashboard/components/AdminDashboard';
import { OwnerDashboard } from '@/features/dashboard/components/OwnerDashboard';
import { TenantDashboard } from '@/features/dashboard/components/TenantDashboard';

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

