// File Path: apps/frontend/src/app/(main)/layout.tsx
'use client'; 

import { ReactNode } from "react";
import { usePathname } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";

// This "smart" layout component is now the single source of truth for layouts.
export default function MainAppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const isHomePage = pathname === '/';

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading Application...</div>;
  }

  // If the user is logged in and NOT on the homepage, show the full dashboard layout.
  // This will apply the sidebar to the property detail page, agreements page, etc.
  if (user && !isHomePage) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // Otherwise, for logged-out users OR for any user on the homepage,
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

