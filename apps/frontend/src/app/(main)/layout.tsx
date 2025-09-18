// File Path: apps/frontend/src/app/(main)/layout.tsx
'use client'; 

import { Navbar } from "@/components/layout/Navbar";
import { ReactNode } from "react";
import { usePathname } from 'next/navigation';

export default function MainAppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isHomePage = pathname === '/';
  const isPropertySearchPage = pathname === '/properties';

  return (
    <div>
      {!isAdminRoute && <Navbar />}
      <main className={!isHomePage && !isAdminRoute && !isPropertySearchPage ? "p-4 sm:p-6 lg:p-8" : ""}>
        {children}
      </main>
    </div>
  );
}

