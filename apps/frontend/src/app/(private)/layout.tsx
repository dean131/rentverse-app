// File Path: apps/frontend/src/app/(private)/layout.tsx
'use client';

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";

// This layout is for all private, authenticated pages (dashboard, agreements, etc.).
export default function PrivateLayout({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // This is an auth guard. If the auth check is done and there's no user,
        // it redirects to the login page.
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    // Show a loading state while authentication is being verified
    if (isLoading || !user) {
        return <div className="flex h-screen items-center justify-center">Authenticating...</div>;
    }
    
    // If the user is authenticated, show the dashboard layout.
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}
