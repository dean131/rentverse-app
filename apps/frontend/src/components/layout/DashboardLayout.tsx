// File Path: apps/frontend/src/components/layout/DashboardLayout.tsx
// RENAMED from AdminLayout.tsx and moved to a more general location

import { ReactNode } from 'react';
import { Sidebar } from '@/components/admin/layout/Sidebar'; // Sidebar can be made dynamic later
import { Header } from '@/components/admin/layout/Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
