// File Path: apps/frontend/src/app/(main)/layout.tsx
'use client'; 

import { Navbar } from "@/components/layout/Navbar";
import { ReactNode } from "react";
import { usePathname } from 'next/navigation';

export default function MainAppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  // Check if the current route is the homepage
  const isHomePage = pathname === '/';

  return (
    <div>
      {!isAdminRoute && <Navbar />}
      
      {/* CORRECTED: 
        - Apply padding to all main-layout pages EXCEPT the homepage and admin routes.
        - The homepage and admin layout handle their own padding.
      */}
      <main className={!isHomePage && !isAdminRoute ? "p-4 sm:p-6 lg:p-8" : ""}>
        {children}
      </main>
    </div>
  );
}

