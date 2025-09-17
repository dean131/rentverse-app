'use client'; // Required to use the usePathname hook

import { Navbar } from "@/components/layout/Navbar";
import { ReactNode } from "react";
import { usePathname } from 'next/navigation';

export default function MainAppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Check if the current route is part of the admin section
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div>
      {/* Only render the public Navbar if it's NOT an admin route */}
      {!isAdminRoute && <Navbar />}
      
      {/* Conditionally apply padding. 
        The AdminLayout will handle its own padding.
      */}
      <main className={!isAdminRoute ? "p-4 sm:p-6 lg:p-8" : ""}>
        {children}
      </main>
    </div>
  );
}

