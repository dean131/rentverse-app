// File Path: apps/frontend/src/app/(main)/layout.tsx
'use client'; 

import { ReactNode } from "react";
import { usePathname } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";

// This "smart" layout component now uses an explicit list of dashboard routes.
export default function MainAppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  // CORRECTED: Define which routes should use the full dashboard layout.
  // The property detail page is NOT on this list.
  const dashboardRoutes = [
    '/dashboard',
    '/agreements',
    '/properties/submit',
  ];

  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading Application...</div>;
  }

  // If the user is on a dashboard route AND is logged in, show the dashboard layout.
  if (isDashboardRoute && user) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // Otherwise, for all other pages (homepage, property details, etc.),
  // show the standard public layout with a navbar and footer.
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}