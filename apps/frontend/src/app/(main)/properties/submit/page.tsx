// File Path: apps/frontend/src/app/(main)/properties/submit/page.tsx
'use client';

import { PropertySubmissionForm } from '@/components/properties/PropertySubmissionForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SubmitPropertyPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Protect this route
    if (!isLoading && (!user || user.role !== 'PROPERTY_OWNER')) {
      // Redirect non-owners or unauthenticated users
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    // Show a loading state or return null while we verify the user
    return <div className="text-center p-10">Verifying access...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">List a New Property</h1>
      <PropertySubmissionForm />
    </div>
  );
}
