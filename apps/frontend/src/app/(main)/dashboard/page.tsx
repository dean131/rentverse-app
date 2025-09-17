// File Path: apps/frontend/src/app/(main)/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the authentication check is complete and there's no user, redirect to login.
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Display a loading state while we verify the user's session.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Once loaded, if the user is authenticated, render the dashboard.
  return (
    user && (
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to your Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            You are logged in as a {user.role.replace('_', ' ').toLowerCase()}.
          </p>

          {/* Role-specific content */}
          {user.role === 'PROPERTY_OWNER' && (
            <Card title="Manage Your Properties">
              <p className="mb-4">Here you can manage your listings, view their status, and create new ones.</p>
              <Link href="/properties/submit" passHref>
                 <Button>
                    Submit a New Property
                 </Button>
              </Link>
            </Card>
          )}

          {user.role === 'TENANT' && (
            <Card title="Find Your Next Home">
              <p className="mb-4">Browse listings, save your favorites, and manage your rental applications.</p>
               <Link href="/" passHref>
                 <Button>
                    Browse Properties
                 </Button>
              </Link>
            </Card>
          )}

          {user.role === 'ADMIN' && (
             <Card title="Admin Panel">
              <p className="mb-4">Review pending property submissions and manage platform content.</p>
               <Link href="/admin" passHref>
                 <Button>
                    Go to Admin Dashboard
                 </Button>
              </Link>
            </Card>
          )}
        </div>
      </main>
    )
  );
}

