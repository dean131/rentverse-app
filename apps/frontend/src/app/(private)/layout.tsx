// File Path: frontend/src/app/(private)/layout.tsx
'use client';

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/features/auth/useAuth";
import { DashboardLayout } from "@/ui/layout/DashboardLayout";
import { useRouter } from "next/navigation";

export default function PrivateLayout({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return <div className="flex h-screen items-center justify-center">Authenticating...</div>;
    }
    
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}